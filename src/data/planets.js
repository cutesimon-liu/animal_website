import sunImage from '../assets/images/planets/sun.png';
import mercuryImage from '../assets/images/planets/mercury.png';
import venusImage from '../assets/images/planets/venus.png';
import earthImage from '../assets/images/planets/earth.png';
import marsImage from '../assets/images/planets/mars.png';
import jupiterImage from '../assets/images/planets/jupiter.png';
import saturnImage from '../assets/images/planets/saturn.png';
import uranusImage from '../assets/images/planets/uranus.png';
import neptuneImage from '../assets/images/planets/neptune.png';
import moonImage from '../assets/images/planets/moon.png';
import asteroidBeltImage from '../assets/images/planets/asteroid-belt.png'; // Placeholder
import meteorImage from '../assets/images/planets/meteor.png';

export const solarSystemData = {
  source: "NASA",
  source_url: "https://science.nasa.gov/solar-system/",
  planets: [
    {
      id: "sun",
      name: "太陽",
      name_en: "Sun",
      description: "太陽是位於太陽系中心的恆星。它是一個近乎完美的熱電漿球體，其核心的核融合反應將其加熱至白熾狀態。",
      image: sunImage,
      facts: {
        "直徑": "1,392,700 km",
        "質量": "1.989 × 10^30 kg",
        "表面溫度": "5,505 °C",
      },
      size: 3
    },
    {
      id: "mercury",
      name: "水星",
      name_en: "Mercury",
      description: "水星是太陽系中最小的行星，也是最靠近太陽的行星。它的軌道週期為87.97個地球日，是所有行星中最短的。",
      image: mercuryImage,
      facts: {
        "直徑": "4,879 km",
        "質量": "3.285 × 10^23 kg",
        "軌道週期": "88 天",
      },
      size: 0.2
    },
    {
      id: "venus",
      name: "金星",
      name_en: "Venus",
      description: "金星是距離太陽第二近的行星。它的名字來自羅馬的愛與美之女神。作為夜空中除了月亮之外最亮的自然物體，金星可以投下陰影，在極少數情況下，白天也能用肉眼看到。",
      image: venusImage,
      facts: {
        "直徑": "12,104 km",
        "質量": "4.867 × 10^24 kg",
        "軌道週期": "225 天",
      },
      size: 0.4
    },
    {
      id: "earth",
      name: "地球",
      name_en: "Earth",
      description: "地球是距離太陽第三近的行星，也是目前已知唯一擁有生命的宇宙天體。地球表面約29.2%是陸地，由大陸和島嶼組成。",
      image: earthImage,
      facts: {
        "直徑": "12,742 km",
        "質量": "5.972 × 10^24 kg",
        "軌道週期": "365.25 天",
      },
      size: 0.45
    },
    {
      id: "moon",
      name: "月球",
      name_en: "The Moon",
      description: "月球是地球唯一的天然衛星。它是太陽系中第五大的衛星，並且是行星衛星中相對於其行星大小最大的衛星。月球處於與地球同步自轉的狀態，因此總是幾乎以同一面朝向地球。",
      image: moonImage,
      facts: {
        "直徑": "3,474 km",
        "與地球的平均距離": "384,400 km",
        "軌道週期": "27.3 天",
        "表面溫度 (白天)": "127 °C",
        "表面溫度 (夜晚)": "-173 °C"
      },
      size: 0.12
    },
    {
      id: "mars",
      name: "火星",
      name_en: "Mars",
      description: "火星是距離太陽第四近的行星，也是太陽系中第二小的行星，僅比水星大。在英語中，火星以羅馬戰神的名字命名，並常被稱為「紅色星球」。",
      image: marsImage,
      facts: {
        "直徑": "6,779 km",
        "質量": "6.39 × 10^23 kg",
        "軌道週期": "687 天",
      },
      size: 0.3
    },
    {
      id: "asteroid-belt",
      name: "小行星帶",
      name_en: "The Asteroid Belt",
      description: "小行星帶是太陽系中位於火星和木星軌道之間的一個區域，由大量固體、不規則形狀的天體（稱為小行星或微型行星）佔據。與科幻小說中的描繪相反，小行星帶中的物體非常分散，平均間隔約為96.5萬公里。",
      image: asteroidBeltImage,
      facts: {
        "位置": "火星與木星之間",
        "總質量": "約為月球質量的3%",
        "主要構成": "岩石與金屬",
        "最大天體": "穀神星 (Ceres)",
        "估計小行星數量": "超過一百萬顆 (直徑大於1公里)"
      },
      size: 0 // Not a single object
    },
    {
        id: "jupiter",
        name: "木星",
        name_en: "Jupiter",
        description: "木星是距離太陽第五近的行星，也是太陽系中最大的行星。它是一個氣態巨行星，其質量是太陽系中所有其他行星質量總和的兩倍半以上，但略低於太陽質量的一千分之一。",
        image: jupiterImage,
        facts: {
            "直徑": "139,820 km",
            "質量": "1.898 × 10^27 kg",
            "軌道週期": "11.86 年",
        },
        size: 1.2
    },
    {
        id: "saturn",
        name: "土星",
        name_en: "Saturn",
        description: "土星是距離太陽第六近的行星，也是太陽系中僅次於木星的第二大行星。它是一個氣態巨行星，平均半徑約為地球的九倍半。它的平均密度只有地球的八分之一，然而，由於其體積較大，土星的質量是地球的95倍以上。",
        image: saturnImage,
        facts: {
            "直徑": "116,460 km",
            "質量": "5.683 × 10^26 kg",
            "軌道週期": "29.45 年",
        },
        size: 1
    },
    {
        id: "uranus",
        name: "天王星",
        name_en: "Uranus",
        description: "天王星是距離太陽第七近的行星。它擁有太陽系中第三大的行星半徑和第四大的行星質量。天王星的組成與海王星相似，兩者的大部分化學組成都與更大的氣態巨行星木星和土星不同。",
        image: uranusImage,
        facts: {
            "直徑": "50,724 km",
            "質量": "8.681 × 10^25 kg",
            "軌道週期": "84 年",
        },
        size: 0.8
    },
    {
        id: "neptune",
        name: "海王星",
        name_en: "Neptune",
        description: "海王星是距離太陽第八遠且已知的最遠的行星。在太陽系中，它是直徑第四大、質量第三大的行星，也是最密集的巨行星。它的質量是地球的17倍，比它的近雙胞胎天王星略大一些。",
        image: neptuneImage,
        facts: {
            "直徑": "49,244 km",
            "質量": "1.024 × 10^26 kg",
            "軌道週期": "164.8 年",
        },
        size: 0.75
    },
    {
      id: "meteor",
      name: "流星",
      name_en: "Meteor",
      description: "流星是當微小的太空塵埃或岩石（稱為流星體）進入地球大氣層並高速燃燒時，所產生的可見光跡。這些粒子的大小可以從一粒沙到一顆小石頭不等。當它們以每秒數十公里的速度撞擊大氣層時，空氣的摩擦力會將其加熱至白熾狀態，形成一道短暫的亮光。如果流星體在完全蒸發前到達地面，則被稱為隕石。",
      image: meteorImage,
      facts: {
        "大小": "通常為沙粒到卵石大小",
        "速度": "11-72公里/秒",
        "可見高度": "75-120公里",
        "來源": "通常是彗星或小行星的碎片"
      },
      size: 0.1
    }
  ]
};