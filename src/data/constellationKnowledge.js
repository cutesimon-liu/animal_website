
const constellationKnowledge = [
  {
    id: 'what-are-constellations',
    title: '什麼是星座？',
    shortDescription: '星座是夜空中由星星組成的特定圖案，目前官方認可的星座有88個。',
    fullDescription: '星座是天空中一群星星的組合，它們在視覺上形成一個圖案。這些圖案通常以神話人物、動物或物體命名。國際天文學聯合會（IAU）將整個天空劃分為88個官方星座。',
    sourceName: '國際天文學聯合會',
    sourceUrl: 'https://www.iau.org/public/themes/constellations/',
    imageUrl: 'https://i.imgur.com/6gC5S7S.jpeg'
  },
  {
    id: 'zodiac-constellations',
    title: '黃道十二宮',
    shortDescription: '黃道十二宮是太陽在一年中似乎會經過的星座。',
    fullDescription: '黃道十二宮是位於黃道帶上的星座，黃道是太陽、月亮和行星在天空中移動的路徑。雖然傳統占星學只使用12個星座，但實際上黃道帶上還有第13個星座，蛇夫座。',
    sourceName: '維基百科',
    sourceUrl: 'https://zh.wikipedia.org/wiki/%E9%BB%84%E9%81%93%E5%8D%81%E4%BA%8C%E5%AE%AE',
    imageUrl: 'https://i.imgur.com/tZ2wY8g.jpeg'
  },
  {
    id: 'asterisms',
    title: '星群 (Asterisms)',
    shortDescription: '星群是天空中容易辨認的星星圖案，但它不是官方認可的星座。',
    fullDescription: '星群是一些顯眼的星星組成的圖案，但它們不是88個官方星座之一。例如，北斗七星（The Big Dipper）就是一個著名的星群，它其實是屬於大熊座（Ursa Major）的一部分。',
    sourceName: '維基百科',
    sourceUrl: 'https://en.wikipedia.org/wiki/Asterism_(astronomy)',
    imageUrl: 'https://i.imgur.com/7Y4Y2yV.jpeg'
  },
  {
    id: 'hydra-constellation',
    title: '最大的星座：長蛇座',
    shortDescription: '長蛇座是88個星座中面積最大的一個。',
    fullDescription: '長蛇座（Hydra）是所有星座中佔據天空面積最大的一個，延伸超過了夜空的3%。它也是最長的星座，從頭到尾橫跨了130多度。',
    sourceName: '維基百科',
    sourceUrl: 'https://en.wikipedia.org/wiki/Hydra_(constellation)',
    imageUrl: 'https://i.imgur.com/xQYV5m8.jpeg'
  },
  {
    id: 'crux-constellation',
    title: '最小的星座：南十字座',
    shortDescription: '南十字座是面積最小的星座，但在南半球非常重要。',
    fullDescription: '南十字座（Crux）是88個星座中最小的一個，但它非常明亮且容易辨認，在南半球被廣泛用於導航，指向南方。',
    sourceName: '維基百科',
    sourceUrl: 'https://en.wikipedia.org/wiki/Crux',
    imageUrl: 'https://i.imgur.com/jX2wL0T.jpeg'
  },
  {
    id: 'star-distances',
    title: '星星的距離',
    shortDescription: '星座中的星星看起來很近，但實際上它們可能相距很遠。',
    fullDescription: '從地球上看，星座中的星星似乎在同一個平面上，但實際上它們與我們的距離可能相差數百光年。有些星星因為離我們很近而顯得明亮，而另一些則是因為它們本身非常巨大和明亮。',
    sourceName: 'NASA',
    sourceUrl: 'https://spaceplace.nasa.gov/constellations/en/',
    imageUrl: 'https://i.imgur.com/fX6wU0Y.jpeg'
  },
  {
    id: 'constellation-uses',
    title: '星座的用途',
    shortDescription: '從古至今，星座一直被用於導航、計時和天文學研究。',
    fullDescription: '在古代，農夫利用星座來判斷播種和收成的時間，水手則依靠星座來指引方向。今天，天文學家仍然使用星座作為標記，來定位天空中的特定天體，例如流星雨的輻射點通常會以其所在的星座來命名。',
    sourceName: 'Ducksters',
    sourceUrl: 'https://www.ducksters.com/science/physics/constellations.php',
    imageUrl: 'https://i.imgur.com/9g4xR2g.jpeg'
  },
  {
    id: 'history-of-constellations',
    title: '星座的歷史',
    shortDescription: '星座的起源可以追溯到數千年前的古文明。',
    fullDescription: '古代文明，如巴比倫人、埃及人和希臘人，是最初將星星分組並賦予其意義的人。他們利用星座來追蹤時間、季節變化，並將其融入神話和宗教信仰中。許多我們今天所知的星座名稱和故事都源自古希臘文化。',
    sourceName: '國家地理',
    sourceUrl: 'https://www.nationalgeographic.com/science/article/constellations',
    imageUrl: 'https://i.imgur.com/g1Y2X3Z.jpeg'
  },
  {
    id: 'constellations-and-astrology',
    title: '星座與占星術',
    shortDescription: '占星術將星座與人類命運和性格聯繫起來。',
    fullDescription: '占星術是一種古老的信仰體系，它認為天體的位置和運動會影響地球上的事件和人類的生活。每個黃道星座都與特定的性格特徵和命運預測相關聯。然而，現代科學並不認為占星術具有科學依據。',
    sourceName: '占星術維基百科',
    sourceUrl: 'https://zh.wikipedia.org/wiki/%E5%8D%A0%E6%98%9F%E8%A1%93',
    imageUrl: 'https://i.imgur.com/h7Y8Z9W.jpeg'
  },
  {
    id: 'constellation-observation',
    title: '星座觀測',
    shortDescription: '觀測星座需要黑暗的天空和對星圖的了解。',
    fullDescription: '觀測星座的最佳條件是在遠離城市光害的黑暗地點。使用星圖或天文應用程式可以幫助識別不同的星座。雙筒望遠鏡或小型望遠鏡可以揭示星座中更暗淡的星星和深空天體，如星團和星雲。',
    sourceName: '觀星指南',
    sourceUrl: 'https://www.skyandtelescope.com/observing/stargazing-basics/',
    imageUrl: 'https://i.imgur.com/k9X0L1P.jpeg'
  }
];

export default constellationKnowledge;
