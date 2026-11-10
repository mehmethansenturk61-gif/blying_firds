import { BALANCE as B, LAYOUT as L, WORLD_H as H, MODES } from '../constants/config';

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const GROUND_Y = H - L.GROUND_H;

export function createGame(worldW, mode, water = false) {
  const g = {
    W: worldW, mode, phase: 'ready', // ready | playing | dead | over
    t: 0, flapTimer: 0, scroll: 0, speed: B.START_SPEED, score: 0,
    lives: MODES[mode].lives, invincible: 0, deadTimer: 0, spawned: 0,
    bird: { x: worldW * L.BIRD_X_RATIO, y: H * 0.4, vy: 0, angle: 0 },
    obstacles: [],
    water, particles: [], pid: 0, landed: false, landT: 0, burstCd: 0,
  };
  fillObstacles(g);
  return g;
}

// Yere/denize çarpma efekti: su varsa damlalar + halkalar, yoksa toz bulutu
function burst(g, power) {
  const { x } = g.bird;
  const add = (p) => g.particles.push({ id: g.pid++, vx: 0, vy: 0, age: 0, ...p });
  if (g.water) {
    const n = Math.round(8 * power) + 4;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + rand(-0.9, 0.9), sp = rand(130, 300) * (0.55 + power * 0.55);
      add({ kind: 'drop', x: x + rand(-10, 10), y: GROUND_Y + 2, vx: Math.cos(a) * sp * 0.6, vy: Math.sin(a) * sp, life: rand(0.55, 0.9), r: rand(2.5, 5.5) });
    }
    for (let k = 0; k < 3; k++) add({ kind: 'ring', x, y: GROUND_Y + 8 + k * 3, age: -k * 0.12, life: 0.9, r: 8 });
  } else {
    const n = Math.round(7 * power) + 3;
    for (let i = 0; i < n; i++) {
      add({ kind: 'dust', x: x + rand(-14, 14), y: GROUND_Y - 2, vx: rand(-110, 110), vy: rand(-90, -20), life: rand(0.6, 1.0), r: rand(5, 11) });
    }
  }
}

function updateParticles(g, dt) {
  for (const p of g.particles) {
    p.age += dt;
    if (p.age < 0) continue;
    if (p.kind === 'drop') p.vy += 900 * dt;
    if (p.kind === 'dust') p.vx *= Math.max(0, 1 - 2.5 * dt);
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
  g.particles = g.particles.filter((p) => p.age < p.life);
}

// Boşluğun o anki merkezi (hareketli engellerde sinüsle değişir)
export function gapCenter(o) {
  return o.moving ? o.baseY + o.amp * Math.sin(o.t * B.MOVING_SPEED + o.phase) : o.baseY;
}

function spawn(g, x) {
  const half = B.GAP_SIZE / 2;
  const lo = L.EDGE_MARGIN + half;
  const hi = GROUND_Y - L.EDGE_MARGIN - half;
  const moving = g.spawned >= B.MOVING_START_SCORE && Math.random() < B.MOVING_CHANCE;
  // Genlik, boşluğun ekran dışına taşmayacağı (her zaman geçilebilir kalacağı) şekilde sınırlanır
  const amp = moving ? Math.min(B.MOVING_AMPLITUDE, (hi - lo) / 2) : 0;
  g.obstacles.push({
    id: g.spawned, x, baseY: rand(lo + amp, hi - amp), moving, amp,
    phase: rand(0, Math.PI * 2), t: 0, passed: false,
  });
  g.spawned++;
}

function fillObstacles(g) {
  let last = g.obstacles.length ? g.obstacles[g.obstacles.length - 1].x : g.W + 60 - B.OBSTACLE_SPACING;
  while (last + B.OBSTACLE_SPACING < g.W + 120) {
    last += B.OBSTACLE_SPACING;
    spawn(g, last);
  }
}

export function flap(g) {
  if (g.phase === 'ready') g.phase = 'playing';
  if (g.phase === 'playing') {
    g.bird.vy = B.JUMP_VELOCITY;
    g.flapTimer = 0.3;
  }
}

function circleRect(cx, cy, r, rx, ry, rw, rh) {
  const dx = cx - clamp(cx, rx, rx + rw);
  const dy = cy - clamp(cy, ry, ry + rh);
  return dx * dx + dy * dy < r * r;
}

function hitsObstacle(g) {
  const { x, y } = g.bird;
  const r = L.BIRD_RADIUS - 1, inset = 8, w = B.OBSTACLE_WIDTH - inset * 2, half = B.GAP_SIZE / 2;
  for (const o of g.obstacles) {
    if (o.x > x + r + B.OBSTACLE_WIDTH || o.x + B.OBSTACLE_WIDTH < x - r) continue;
    const c = gapCenter(o);
    if (
      circleRect(x, y, r, o.x + inset, 0, w, c - half) ||
      circleRect(x, y, r, o.x + inset, c + half, w, GROUND_Y - (c + half))
    ) return true;
  }
  return false;
}

function damage(g) {
  g.lives = Math.max(0, g.lives - 1);
  if (g.lives <= 0) {
    g.phase = 'dead';
    g.deadTimer = 0;
    g.bird.vy = -200;
  } else {
    g.invincible = B.INVINCIBLE_TIME;
  }
}

// dt: saniye cinsinden geçen süre (delta time) — hız her cihazda aynıdır
export function update(g, dt) {
  g.t += dt;
  g.flapTimer = Math.max(0, g.flapTimer - dt);
  g.burstCd = Math.max(0, g.burstCd - dt);
  updateParticles(g, dt);
  const b = g.bird;

  if (g.phase === 'ready') {
    b.y = H * 0.4 + Math.sin(g.t * 4) * 8;
    b.angle = 0;
    g.scroll += B.START_SPEED * 0.4 * dt;
    return;
  }
  if (g.phase === 'dead') {
    g.deadTimer += dt;
    b.vy = Math.min(b.vy + B.GRAVITY * dt, B.MAX_FALL_SPEED);
    b.y += b.vy * dt;
    b.angle = Math.min(90, b.angle + 300 * dt);
    const floor = GROUND_Y - L.BIRD_RADIUS;
    if (b.y >= floor) {
      if (!g.landed) { g.landed = true; b.y = floor; burst(g, 1); }
      g.landT += dt;
      // Denizde kuş yavaşça batar, karada yerde kalır
      if (g.water) { b.vy = 0; b.y = Math.min(floor + 26, b.y + 38 * dt); } else b.y = floor;
      if (g.landT > 0.6) g.phase = 'over';
    }
    if (g.deadTimer > 1.4) g.phase = 'over';
    return;
  }
  if (g.phase !== 'playing') return;

  b.vy = Math.min(b.vy + B.GRAVITY * dt, B.MAX_FALL_SPEED);
  b.y += b.vy * dt;
  b.angle = clamp(b.vy * 0.1, -25, 70);

  // Hız yavaş yavaş hedefe yaklaşır (ani sıçrama yok, üst sınırı var)
  const target = Math.min(B.MAX_SPEED, B.START_SPEED + g.score * B.SPEED_PER_SCORE);
  g.speed += (target - g.speed) * Math.min(1, dt * B.SPEED_SMOOTHING);
  const dx = g.speed * dt;
  g.scroll += dx;
  for (const p of g.particles) p.x -= dx; // efektler zeminle birlikte kayar
  g.invincible = Math.max(0, g.invincible - dt);

  for (const o of g.obstacles) {
    o.x -= dx;
    o.t += dt;
    if (!o.passed && o.x + B.OBSTACLE_WIDTH < b.x - L.BIRD_RADIUS) {
      o.passed = true;
      g.score++;
    }
  }
  while (g.obstacles.length && g.obstacles[0].x < -B.OBSTACLE_WIDTH - 20) g.obstacles.shift();
  fillObstacles(g);

  let hit = false;
  const r = L.BIRD_RADIUS;
  if (b.y + r >= GROUND_Y) {
    b.y = GROUND_Y - r;
    b.vy = B.JUMP_VELOCITY * 0.85; // yerden sekme
    if (g.burstCd <= 0) { burst(g, 0.6); g.burstCd = 0.3; }
    if (g.invincible <= 0) hit = true;
  }
  if (b.y - r <= 0) {
    b.y = r;
    if (b.vy < 0) b.vy = 0;
    if (g.invincible <= 0) hit = true;
  }
  if (!hit && g.invincible <= 0) hit = hitsObstacle(g);
  if (hit) damage(g);
}
