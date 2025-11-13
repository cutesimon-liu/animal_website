import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ScienceTimelinePage.css';

const physicsEvents = [
  {
    id: 'classical-mechanics',
    year: '1687',
    title: '牛頓發表《自然哲學的數學原理》',
    description: '艾薩克·牛頓出版了他的巨著，提出了運動三大定律和萬有引力定律，為古典力學奠定了基礎。',
    category: {
      tag: '古典力學',
      color: '#FF6B6B'
    }
  },
  {
    id: 'quantum-hypothesis',
    year: '1900',
    title: '普朗克提出量子假說',
    description: '馬克斯·普朗克為解釋黑體輻射，大膽提出能量是以「量子」形式發射和吸收的，開啟了量子物理學的序幕。',
    category: {
      tag: '量子力學',
      color: '#F7B801'
    }
  },
  {
    id: 'electromagnetism',
    year: '1865',
    title: '馬克士威方程組',
    description: '詹姆斯·克拉克·馬克士威提出了一組方程，統一了電、磁和光，證明了光是一種電磁波。',
    category: {
      tag: '電磁學',
      color: '#4ECDC4'
    }
  },
  {
    id: 'relativity',
    year: '1905',
    title: '愛因斯坦的奇蹟年',
    description: '阿爾伯特·愛因斯坦發表了四篇劃時代的論文，提出了狹義相對論、質能等價（E=mc²）和光電效應的解釋。',
    category: {
      tag: '相對論',
      color: '#45B7D1'
    }
  },
  {
    id: 'relativity',
    year: '1915',
    title: '廣義相對論',
    description: '愛因斯坦進一步發展了他的理論，將引力描述為時空的彎曲，徹底改變了我們對宇宙的理解。',
    category: {
      tag: '相對論',
      color: '#45B7D1'
    }
  },
  {
    id: 'quantum-mechanics',
    year: '1927',
    title: '量子力學的成熟',
    description: '第五次索爾維會議標誌著量子力學的成熟。海森堡提出了不確定性原理，波耳提出了互補原理。',
    category: {
      tag: '量子力學',
      color: '#F7B801'
    }
  },
  {
    id: 'neutron-discovery',
    year: '1932',
    title: '查德威克發現中子',
    description: '詹姆斯·查德威克發現了原子核中的中性粒子——中子，完善了原子結構模型，為核物理學發展奠定基礎。',
    category: {
      tag: '核物理',
      color: '#AB63FA'
    }
  },
  {
    id: 'cosmology',
    year: '1964',
    title: '宇宙微波背景輻射的發現',
    description: '阿諾·彭齊亞斯和羅伯特·威爾遜意外發現了宇宙微波背景輻射，為宇宙大爆炸理論提供了強有力的證據。',
    category: {
      tag: '宇宙學',
      color: '#AB63FA'
    }
  },
  {
    id: 'standard-model',
    year: '1970s',
    title: '粒子物理學標準模型',
    description: '描述了構成物質的基本粒子及其間四種基本交互作用中的三種（強、弱、電磁）的理論框架。',
    category: {
      tag: '粒子物理',
      color: '#FF6B6B'
    }
  },
];

const chemistryEvents = [
    {
        id: 'conservation-of-mass',
        year: '1789',
        title: '拉瓦錫發表《化學基本論》',
        description: '安托萬-洛朗·德·拉瓦錫出版了第一本現代化學教科書，提出了質量守恆定律，被譽為「現代化學之父」。',
        category: {
          tag: '化學基礎',
          color: '#51E29A'
        }
    },
    {
        id: 'wohler-synthesis',
        year: '1828',
        title: '維勒合成尿素',
        description: '弗里德里希·維勒首次從無機物合成有機物尿素，打破了有機物只能由生命體產生的「生機論」。',
        category: {
          tag: '有機化學',
          color: '#7D51E2'
        }
    },
    {
        id: 'atomic-theory',
        year: '1808',
        title: '道爾頓的原子理論',
        description: '約翰·道爾頓提出原子理論，認為所有物質都是由微小的、不可分割的原子組成，為化學計量學奠定基礎。',
        category: {
          tag: '原子理論',
          color: '#7D51E2'
        }
    },
    {
        id: 'periodic-table',
        year: '1869',
        title: '門得列夫的元素週期表',
        description: '德米特里·門得列夫根據原子量排列化學元素，並預測了尚未發現的元素，創建了元素週期表。',
        category: {
          tag: '元素週期表',
          color: '#E2518B'
        }
    },
    {
        id: 'electron-discovery',
        year: '1897',
        title: '湯姆森發現電子',
        description: '約瑟夫·湯姆森透過陰極射線實驗發現了電子，證明原子並非不可分割，開啟了原子結構研究的新篇章。',
        category: {
          tag: '原子結構',
          color: '#E2A051'
        }
    },
    {
        id: 'atomic-nucleus',
        year: '1911',
        title: '拉塞福發現原子核',
        description: '歐尼斯特·拉塞福透過金箔實驗，證明了原子有一個帶正電且集中的核心，即原子核。',
        category: {
          tag: '原子結構',
          color: '#E2A051'
        }
    },
    {
        id: 'schrodinger-equation',
        year: '1926',
        title: '薛丁格方程式',
        description: '埃爾溫·薛丁格提出了描述量子力學系統中粒子行為的波動方程式，成為量子化學的基礎。',
        category: {
          tag: '量子化學',
          color: '#51AEE2'
        }
    },
    {
        id: 'dna-structure',
        year: '1953',
        title: '華生和克里克發現DNA雙螺旋結構',
        description: '詹姆斯·華生和法蘭西斯·克里克提出了DNA的雙螺旋結構，揭示了遺傳訊息的儲存和傳遞方式。',
        category: {
          tag: '分子生物學',
          color: '#51AEE2'
        }
    },
];

const timelines = {
    physics: {
        title: '物理學大事紀',
        events: physicsEvents,
    },
    chemistry: {
        title: '化學大事紀',
        events: chemistryEvents,
    }
};

const ScienceTimelinePage = () => {
    const [activeTimeline, setActiveTimeline] = useState('physics');

    const { title, events } = timelines[activeTimeline];

    return (
        <div className="timeline-page-container">
            <div className="timeline-switcher">
                <button 
                    className={`switcher-btn ${activeTimeline === 'physics' ? 'active' : ''}`}
                    onClick={() => setActiveTimeline('physics')}
                >
                    物理學
                </button>
                <button 
                    className={`switcher-btn ${activeTimeline === 'chemistry' ? 'active' : ''}`}
                    onClick={() => setActiveTimeline('chemistry')}
                >
                    化學
                </button>
            </div>

            <h1 className="timeline-page-title">{title}</h1>
            <p className="timeline-page-subtitle">將滑鼠移動到時間節點上以查看詳細資訊</p>
            <div className="timeline-container">
                {events.map((event, index) => (
                <div className="timeline-item" key={index}>
                    <div className="timeline-node">
                    <div className="timeline-year">{event.year}</div>
                    <div className="timeline-circle"></div>
                    </div>
                    <div className="timeline-item-content">
                        <span className="tag" style={{ background: event.category.color }}>
                            {event.category.tag}
                        </span>
                        <h2>{event.title}</h2>
                        <p>{event.description}</p>
                        <Link to={`/theory/${event.id}`} className="timeline-read-more">深入了解</Link>
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
};

export default ScienceTimelinePage;
