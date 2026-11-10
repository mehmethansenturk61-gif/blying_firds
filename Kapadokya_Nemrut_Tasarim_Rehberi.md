# Kapadokya ve Nemrut Dağı Oyun Tasarımı

Bu belge, oyununuz için Kapadokya ve Nemrut Dağı temalarının nasıl entegre edilebileceğini açıklamaktadır.

## 1. Kapadokya Teması (Kapadokya Bölümü)
* **Arka Plan (Background):** Sabahın erken saatlerinde gökyüzünde süzülen renkli sıcak hava balonları ve alt kısımda peribacaları. Gökyüzü yumuşak turuncu, pembe ve sarı tonlarında olmalıdır.
* **Engeller (Pipes/Obstacles):** Standart yeşil borular yerine, yukarıdan ve aşağıdan sarkan dik peribacası kayalıkları kullanılabilir.
* **Karakter (Bird):** Uçan küçük bir sıcak hava balonu veya yöresel motifler taşıyan bir kuş.
* **Sesler:** Rüzgar sesi, balon ateşleyici sesi (flap sesi yerine).

## 2. Nemrut Dağı Teması (Nemrut Bölümü)
* **Arka Plan (Background):** Gün batımı kızıllığında devasa Kommagene heykelleri (Antiochos, Zeus, Apollon heykelleri) ve dağ silüeti.
* **Engeller (Pipes/Obstacles):** Üst üste dizilmiş antik taş bloklar veya sütunlar.
* **Karakter (Bird):** Kartal (Nemrut Dağı'ndaki koruyucu kartal heykelinden esinlenerek).
* **Sesler:** Daha mistik ve yankılı bir zıplama/kanat sesi.

## Entegrasyon (React Native İçin)
`src/constants/themes.js` veya `src/components/Scenes.js` içerisine şu şekilde yeni temalar eklenebilir:

```javascript
export const THEMES = {
  CAPPADOCIA: {
    background: require('../../assets/cappadocia_bg.png'),
    obstacle: require('../../assets/fairy_chimney.png'),
    bird: require('../../assets/hot_air_balloon.png'),
  },
  NEMRUT: {
    background: require('../../assets/nemrut_bg.png'),
    obstacle: require('../../assets/ancient_pillar.png'),
    bird: require('../../assets/eagle.png'),
  }
};
```
