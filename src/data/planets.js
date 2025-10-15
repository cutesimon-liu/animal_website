import sunImage from '../assets/images/planets/sun.png';
import mercuryImage from '../assets/images/planets/mercury.png';
import venusImage from '../assets/images/planets/venus.png';
import earthImage from '../assets/images/planets/earth.png';
import marsImage from '../assets/images/planets/mars.png';
import jupiterImage from '../assets/images/planets/jupiter.png';
import saturnImage from '../assets/images/planets/saturn.png';
import uranusImage from '../assets/images/planets/uranus.png';
import neptuneImage from '../assets/images/planets/neptune.png';

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
        "Diameter": "1,392,700 km",
        "Mass": "1.989 × 10^30 kg",
        "Surface Temperature": "5,505 °C",
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
        "Diameter": "4,879 km",
        "Mass": "3.285 × 10^23 kg",
        "Orbital Period": "88 days",
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
        "Diameter": "12,104 km",
        "Mass": "4.867 × 10^24 kg",
        "Orbital Period": "225 days",
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
        "Diameter": "12,742 km",
        "Mass": "5.972 × 10^24 kg",
        "Orbital Period": "365.25 days",
      },
      size: 0.45
    },
    {
      id: "mars",
      name: "火星",
      name_en: "Mars",
      description: "火星是距離太陽第四近的行星，也是太陽系中第二小的行星，僅比水星大。在英語中，火星以羅馬戰神的名字命名，並常被稱為「紅色星球」。",
      image: marsImage,
      facts: {
        "Diameter": "6,779 km",
        "Mass": "6.39 × 10^23 kg",
        "Orbital Period": "687 days",
      },
      size: 0.3
    },
    {
        id: "jupiter",
        name: "木星",
        name_en: "Jupiter",
        description: "木星是距離太陽第五近的行星，也是太陽系中最大的行星。它是一個氣態巨行星，其質量是太陽系中所有其他行星質量總和的兩倍半以上，但略低於太陽質量的一千分之一。",
        image: jupiterImage,
        facts: {
            "Diameter": "139,820 km",
            "Mass": "1.898 × 10^27 kg",
            "Orbital Period": "11.86 years",
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
            "Diameter": "116,460 km",
            "Mass": "5.683 × 10^26 kg",
            "Orbital Period": "29.45 years",
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
            "Diameter": "50,724 km",
            "Mass": "8.681 × 10^25 kg",
            "Orbital Period": "84 years",
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
            "Diameter": "49,244 km",
            "Mass": "1.024 × 10^26 kg",
            "Orbital Period": "164.8 years",
        },
        size: 0.75
    }
  ]
};