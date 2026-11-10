import { Platform, StatusBar } from 'react-native';

// Oyun dünyası mantıksal olarak 800 birim yüksekliğindedir; ekrana oranlanarak çizilir.
export const WORLD_H = 800;

// ===== DENGE AYARLARI (buradan oynayın) =====
export const BALANCE = {
  GRAVITY: 1050,          // yerçekimi (birim/sn²)
  JUMP_VELOCITY: -400,    // zıplama gücü (negatif = yukarı)
  MAX_FALL_SPEED: 600,    // en yüksek düşme hızı
  START_SPEED: 190,       // başlangıç yatay hızı (birim/sn)
  MAX_SPEED: 320,         // hız üst sınırı
  SPEED_PER_SCORE: 3.5,   // her puanda hedef hızın artışı (hız yumuşakça artar)
  SPEED_SMOOTHING: 1.5,   // hızın hedefe yaklaşma katsayısı (düşük = daha yumuşak)
  GAP_SIZE: 205,          // dallar arası boşluk genişliği
  OBSTACLE_SPACING: 245,  // iki engel arası yatay mesafe
  OBSTACLE_WIDTH: 70,     // engel genişliği
  MOVING_START_SCORE: 8,  // bu skordan sonra bazı engeller hareket eder
  MOVING_CHANCE: 0.4,     // hareketli engel olasılığı (0-1)
  MOVING_AMPLITUDE: 70,   // yukarı-aşağı hareket genliği
  MOVING_SPEED: 1.6,      // hareket hızı (rad/sn)
  INVINCIBLE_TIME: 1.5,   // "Trio" modunda çarpma sonrası dokunulmazlık (sn)
};

export const LAYOUT = {
  GROUND_H: 90,
  BIRD_X_RATIO: 0.3,
  BIRD_RADIUS: 15,
  BIRD_SCALE: 0.8,
  EDGE_MARGIN: 60,
  MAX_FRAME_ASPECT: 0.62, // masaüstünde oyun alanı en/boy oranı (dikey ekran)
  MAX_DT: 0.05,
};

export const TOP_INSET =
  Platform.OS === 'web' ? 14 : Platform.OS === 'ios' ? 48 : (StatusBar.currentHeight || 24) + 10;

export const MODES = {
  single: { id: 'single', name: 'Solo', lives: 1, desc: 'Tek can. Bir kez çarparsan oyun biter.' },
  triple: { id: 'triple', name: 'Trio', lives: 3, desc: 'Üç can. Çarpınca bir can gider, kısa süre dokunulmaz olursun.' },
};

export const HISTORY_LIMIT = 30; // son oyunlar listesi
export const TOP_LIMIT = 10;     // tüm zamanların en iyi skorları
export const NICK_MIN = 2;
export const NICK_MAX = 12;
