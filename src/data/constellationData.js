// This file now contains Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, and Pisces processed and normalized for correct display.

const geoJsonData = { "type": "FeatureCollection", "features": [
    { "type": "Feature", "properties": { "id": "Ari", "name": "Aries" }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ 42.496, 27.2605 ], [ 31.7934, 23.4624 ], [ 28.66, 20.808 ], [ 28.3826, 19.2939 ] ] ] } },
    { "type": "Feature", "properties": { "id": "Tau", "name": "Taurus" }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ 51.7923, 9.7327 ], [ 51.2033, 9.0289 ], [ 54.2183, 0.4017 ] ], [ [ 64.9483, 15.6276 ], [ 60.1701, 12.4903 ], [ 51.7923, 9.7327 ], [ 60.7891, 5.9893 ] ], [ [ 84.4112, 21.1425 ], [ 68.9802, 16.5093 ], [ 67.1656, 15.8709 ], [ 64.9483, 15.6276 ], [ 65.7337, 17.5425 ], [ 67.1542, 19.1804 ], [ 81.573, 28.6075 ] ] ] } },
    { "type": "Feature", "properties": { "id": "Gem", "name": "Gemini" }, "geometry": { "type": "MultiLineString", "coordinates": [ [ [ 93.7194, 22.5068 ], [ 95.7401, 22.5136 ], [ 100.983, 25.1311 ], [ 107.7849, 30.2452 ], [ 113.6494, 31.8883 ], [ 116.329, 28.0262 ], [ 113.9806, 26.8957 ], [ 110.0307, 21.9823 ], [ 106.0272, 20.5703 ], [ 99.4279, 16.3993 ], [ 101.3224, 12.8956 ] ], [ [ 110.0307, 21.9823 ], [ 109.5232, 16.5404 ] ] ] } },
    {"type":"Feature","properties":{"id":"Cnc","rank":2,"name":"Cancer"},"geometry":{"type":"MultiLineString","coordinates":[[[131.1712,18.1543],[124.1288,9.1855]],[[134.6218,11.8577],[131.1712,18.1543],[130.8214,21.4685],[131.6666,28.7651]]]}},
    {"type":"Feature","properties":{"id":"Leo","rank":1,"name":"Leo"},"geometry":{"type":"MultiLineString","coordinates":[[[154.9931,19.8415],[154.1726,23.4173],[148.1909,26.007],[146.4628,23.7743]],[[152.093,11.9672],[151.8331,16.7627],[154.9931,19.8415],[168.5271,20.5237],[177.2649,14.5721],[168.56,15.4296],[152.093,11.9672]]]}},
    {"type":"Feature","properties":{"id":"Vir","rank":1,"name":"Virgo"},"geometry":{"type":"MultiLineString","coordinates":[[[180,0.9902],[184.9765,-0.6668],[190.4152,-1.4494],[197.4875,-5.539],[201.2982,-11.1613],[214.0036,-6.0005],[220.7651,-5.6582]],[[195.5442,10.9592],[193.9009,3.3975],[190.4152,-1.4494]],[[197.4875,-5.539],[203.6733,-0.5958],[210.4116,1.5445],[221.5622,1.8929]],[[176.4648,6.5294],[177.6738,1.7647],[180,0.9902]]]}},
    {"type":"Feature","properties":{"id":"Lib","rank":2,"name":"Libra"},"geometry":{"type":"MultiLineString","coordinates":[[[-137.2804,-16.0418],[-126.1184,-14.7895]],[[-133.9824,-25.282],[-137.2804,-16.0418],[-130.7483,-9.3829],[-126.1184,-14.7895],[-125.744,-28.1351],[-125.336,-29.7778]]]}},
    {"type":"Feature","properties":{"id":"Sco","rank":1,"name":"Scorpius"},"geometry":{"type":"MultiLineString","coordinates":[[[-120.287,-26.1141],[-119.9166,-22.6217],[-118.6407,-19.8055]],[[-119.9166,-22.6217],[-114.7028,-25.5928],[-112.6481,-26.432],[-111.0294,-28.216],[-107.4591,-34.2932],[-107.0324,-38.0474],[-106.3541,-42.3613],[-101.9617,-43.2392],[-95.6703,-42.9978],[-93.1038,-40.127],[-94.378,-39.03],[-96.5978,-37.1038]]]}},
    {"type":"Feature","properties":{"id":"Sgr","rank":1,"name":"Sagittarius"},"geometry":{"type":"MultiLineString","coordinates":[[[-85.5932,-36.7617],[-83.957,-34.3846],[-84.7515,-29.8281],[-83.0073,-25.4217],[-86.5591,-21.0588]],[[-69.3404,-44.459],[-69.0284,-40.6159],[-74.347,-29.8801],[-78.5859,-26.9908],[-83.0073,-25.4217]],[[-73.8292,-21.7415],[-75.5675,-21.1067],[-76.4576,-22.7448],[-76.1836,-26.2967]],[[-61.1846,-41.8683],[-60.0659,-35.2763],[-61.0402,-26.2995],[-65.8232,-24.8836],[-68.6813,-24.5086],[-71.1149,-25.2567],[-76.1836,-26.2967],[-78.5859,-26.9908],[-84.7515,-29.8281],[-88.548,-30.4241],[-83.957,-34.3846],[-74.347,-29.8801],[-73.265,-27.6704],[-76.1836,-26.2967],[-73.8292,-21.7415],[-72.559,-21.0236],[-70.5913,-18.9529],[-69.5818,-17.8472],[-69.5682,-15.955]]]}},
    {"type":"Feature","properties":{"id":"Cap","rank":2,"name":"Capricornus"},"geometry":{"type":"MultiLineString","coordinates":[[[-55.588,-12.5082],[-54.7472,-14.7814],[-52.7849,-17.8137],[-48.4761,-25.2709],[-47.0446,-26.9191],[-38.3332,-22.4113],[-33.2398,-16.1273],[-34.9773,-16.6623],[-39.4383,-16.8345],[-43.5132,-17.2329],[-55.588,-12.5082]]]}},
    {"type":"Feature","properties":{"id":"Aqr","rank":2,"name":"Aquarius"},"geometry":{"type":"MultiLineString","coordinates":[[[-48.081,-9.4958],[-46.8365,-8.9833],[-37.1103,-5.5712],[-28.554,-0.3199],[-24.5859,-1.3873],[-22.792,-0.02],[-21.1609,-0.1175],[-16.8464,-7.5796],[-10.5241,-9.1825],[-12.6383,-21.1724]],[[-37.1103,-5.5712],[-28.3907,-13.8697]],[[-28.554,-0.3199],[-25.7915,-7.7833]],[[-22.792,-0.02],[-23.6807,1.3774]],[[-9.2574,-20.1006],[-10.5241,-9.1825],[-4.5591,-17.8165]]]}},
    {"type":"Feature","properties":{"id":"Psc","rank":2,"name":"Pisces"},"geometry":{"type":"MultiLineString","coordinates":[[[-41.7086,3.2823],[-45.0308,3.82]],[[-12.5627,24.5837],[-13.0848,30.0896],[-11.1334,27.2641],[-12.5627,24.5837],[-13.1366,21.0347],[-8.1291,15.3458],[-4.6515,9.1577],[-0.4882,2.7638],[-2.611,3.1875],[-5.6421,5.4876],[-8.4537,6.1438],[-12.5671,7.5754],[-15.2641,7.8901],[-18.8294,7.5851],[-31.1721,6.8633],[-36.0123,5.6263],[-39.0079,6.379],[-40.9142,5.3813],[-41.7086,3.2823],[-39.2669,1.2556],[-35.4883,1.78],[-34.402,3.4868],[-36.0123,5.6263]]]}}
]};

const nameMap = {
    'Ari': '白羊座',
    'Tau': '金牛座',
    'Gem': '雙子座',
    'Cnc': '巨蟹座',
    'Leo': '獅子座',
    'Vir': '處女座',
    'Lib': '天秤座',
    'Sco': '天蠍座',
    'Sgr': '射手座',
    'Cap': '摩羯座',
    'Aqr': '水瓶座',
    'Psc': '雙魚座',
};

const zodiacDetails = {
    'ari': {
        knowledge: '白羊座是一個相對較暗的星座，其最亮的星是「婁宿三」（Hamal），視星等約為2.0。這顆星是一顆橙巨星，據信擁有一顆系外行星。第二亮的星是「婁宿一」（Sheratan）。雖然星座本身不亮，但它在天文學上很重要，因為在古代，春分點位於白羊座，標誌著天文年的開始。星座內的深空天體較為黯淡，其中最亮的是一個距離地球約1.3億光年的無棒旋渦星系NGC 772。',
        myth: '白羊座的神話與金羊有關，這隻神奇的公羊長著金色的羊毛。故事講述了佛里克索斯和赫勒這對兄妹被繼母伊諾迫害，即將被獻祭。他們的生母涅斐勒向宙斯求助，宙斯便派了這隻金羊去營救他們。金羊載著兄妹倆飛越海洋，但不幸的是，赫勒在中途掉進海裡淹死了。佛里克索斯安全抵達科爾基斯後，將金羊獻祭給宙斯，並將珍貴的金羊毛掛在聖林中，這便是後來伊阿宋和阿爾戈英雄們尋找的目標。',
        source: 'https://www.greekmythology.com/Myths/Zodiac/Aries/aries.html',
        image: 'aries.png'
    },
    'tau': {
        knowledge: '金牛座是一個非常顯著的星座，擁有許多著名的天體。其最亮的星是「畢宿五」（Aldebaran），一顆巨大的紅巨星，視星等為0.86，常被稱為“公牛的眼睛”。金牛座擁有兩個著名的疏散星團：昴宿星團（Pleiades, M45），俗稱“七姊妹”，肉眼輕易可見；以及畢宿星團（Hyades），構成公牛V形的臉部。此外，著名的蟹狀星雲（Crab Nebula, M1）也位於此星座，這是一個超新星殘骸，是1054年一次劇烈恆星爆炸的結果。',
        myth: '金牛座最著名的神話與宙斯有關。為了贏得美麗的腓尼基公主歐羅巴的芳心，宙斯將自己變成了一頭華麗的白色公牛。歐羅巴被這頭溫順而美麗的公牛吸引，騎上了它的背。宙斯隨即躍入大海，將她帶到了克里特島。在那裡，歐羅巴為宙斯生下了三個兒子。為了紀念這次成功的誘拐，宙斯將公牛的形象升上天空，成為了金牛座。',
        source: 'https://www.greekmythology.com/Myths/Zodiac/Taurus/taurus.html',
        image: 'taurus.png'
    },
    'gem': {
        knowledge: '雙子座以其兩顆明亮的恆星「北河三」（Pollux）和「北河二」（Castor）而聞名。北河三是星座中最亮的星，視星等為+1.14，是夜空中第17亮的恆星。北河二則是一個複雜的六星系統。雙子座包含一個壯觀的疏散星團M35，在黑暗的天空下肉眼可見。此外，愛斯基摩星雲（Eskimo Nebula, NGC 2392）和水母星雲（Medusa Nebula）也是位於雙子座的著名深空天體。',
        myth: '雙子座代表的是希臘神話中的一對同母異父的雙胞胎兄弟——卡斯托和波魯克斯。他們是斯巴達王后麗達的孩子，但卡斯托是凡人，而波魯克斯是宙斯的兒子，擁有永生。兄弟倆感情深厚，形影不離。在一次戰鬥中，卡斯托不幸身亡。悲痛欲絕的波魯克斯請求父親宙斯，希望能與兄弟分享自己的永生。宙斯被他們的兄弟情誼感動，於是將他們一同升上天空，成為雙子座，讓他們永不分離。',
        source: 'https://www.greekmythology.com/Myths/Zodiac/Gemini/gemini.html',
        image: 'gemini.png'
    },
    'cnc': {
        knowledge: '巨蟹座是黃道十二星座中最暗的一個，其最亮的恆星「柳宿增十」（Altarf）的視星等也只有3.5。儘管如此，巨蟹座的中心擁有一個非常著名的深空天體——鬼星團（Praesepe, M44），也稱為蜂巢星團。它是離地球最近的疏散星團之一，在黑暗的天空下肉眼可見，看起來像一團模糊的光斑。這個星團包含了約50顆恆星。另一個疏散星團M67也位於巨蟹座。',
        myth: '巨蟹座的神話與大英雄赫拉克勒斯的十二項勞動之一有關。當赫拉克勒斯與兇猛的九頭蛇許德拉戰鬥時，天后赫拉為了幫助九頭蛇並阻礙赫拉克勒斯，派出了一隻巨大的螃蟹來攻擊他的腳。儘管這隻螃蟹最終被赫拉克勒斯一腳踩碎，但赫拉為了嘉獎它的忠誠和勇敢，便將它升上天空，成為了巨蟹座。',
        source: 'https://www.greekmythology.com/Myths/Zodiac/Cancer/cancer.html',
        image: 'cancer.png'
    },
    'leo': {
        knowledge: '獅子座是一個明亮的星座，其最亮的星是「軒轅十四」（Regulus），這是一個複雜的四星系統，視星等為+1.35。另一顆著名的雙星是「軒轅十三」（Algieba）。獅子座富含星系，其中最著名的是獅子座三胞胎星系群，包括M65、M66和NGC 3628。此外，M95、M96和M105等星系也位於此星座，使其成為天文觀測的重要區域。',
        myth: '獅子座的神話來源於赫拉克勒斯的十二項勞動中的第一項——擊敗尼米亞猛獅。這頭獅子的皮毛刀槍不入，任何武器都無法傷害它。赫拉克勒斯意識到這一點後，最終赤手空拳地將獅子掐死。為了紀念赫拉克勒斯的英勇和這頭獅子的強大，宙斯將獅子的形象升上天空，成為了獅子座。',
        source: 'https://www.greekmythology.com/Myths/Zodiac/Leo/leo.html',
        image: 'leo.png'
    },
    'vir': {
        knowledge: '處女座是黃道十二星座中最大的，也是全天第二大星座。其最亮的星是「角宿一」（Spica），一顆明亮的藍巨星，也是夜空中最亮的恆星之一。處女座因為包含了室女座星系團而聞名，這是一個巨大的星系集團，距離地球約5400萬光年。該星系團包含了數千個星系，其中著名的成員有M49、M58、M87以及草帽星系（M104）。',
        myth: '處女座通常與希臘神話中的正義女神阿斯特賴亞聯繫在一起。在人類的黃金時代，神明與凡人一同生活在地球上，阿斯特賴亞是最後一位離開人間的神。當人類變得越來越墮落時，她對人性感到失望，於是回到了天上，化為處女座，手中的天平則化為天秤座。她象徵著純潔、正義和無邪。處女座也與農業女神得墨忒耳有關，代表著豐收和富饒。',
        source: 'https://www.greekmythology.com/Myths/Zodiac/Virgo/virgo.html',
        image: 'virgo.png'
    },
    'lib': {
        knowledge: '天秤座是一個相對較暗的星座，其最亮的星是「氐宿四」（Zubeneschamali），一顆視星等為2.6的綠色恆星。第二亮的星「氐宿一」（Zubenelgenubi）是一個用雙筒望遠鏡就可以分辨的雙星系統。天秤座包含一個明亮的球狀星團NGC 5897，距離地球約5萬光年。這個星座在天文學上的獨特之處在於它是黃道上唯一一個不以生物命名的星座。',
        myth: '天秤座的象徵——天平，與希臘神話中的正義女神忒彌斯和她的女兒阿斯特賴亞密切相關。阿斯特賴亞在黃金時代結束後離開人間，回到天上成為處女座，而她用來衡量善惡的天平則成為了天秤座。這個星座提醒人們要時刻保持內心的平衡，並在生活中追求公平與正義。',
        source: 'https://www.greekmythology.com/Myths/Zodiac/Libra/libra.html',
        image: 'libra.png'
    },
    'sco': {
        knowledge: '天蠍座位於銀河系的中心方向，因此擁有豐富的深空天體。其最亮的星是「心宿二」（Antares），一顆巨大的紅超巨星，以其顯著的紅色而聞名，常被稱為“火星的對手”。天蠍座包含許多星團，包括蝴蝶星團（M6）和托勒密星團（M7），以及球狀星團M4和M80。此外，貓爪星雲和著名的蛇夫座ρ星雲複合體也部分位於天蠍座。',
        myth: '天蠍座的神話與偉大的獵人奧利翁（獵戶座）有關。奧利翁驕傲地宣稱他可以殺死世界上所有的動物，這激怒了大地女神蓋亞。蓋亞於是派出了一隻巨大的蠍子去攻擊奧利オン。在激烈的戰鬥中，蠍子最終刺中了奧利翁並殺死了他。為了獎勵這隻蠍子，也為了警示世人，眾神將它們雙雙升上天空。這就是為什麼當天蠍座升起時，獵戶座就會落下，兩者在天空中永不相見。',
        source: 'https://www.greekmythology.com/Myths/Zodiac/Scorpio/scorpio.html',
        image: 'scorpio.png'
    },
    'sgr': {
        knowledge: '射手座朝向銀河系的中心，因此是天空中深空天體最密集的區域之一。其最亮的星是「箕宿三」（Kaus Australis）。射手座擁有大量的星雲和星團，其中最著名的是礁湖星雲（M8）、三裂星雲（M20）和歐米茄星雲（M17）。此外，大量的球狀星團和疏散星團也位於此處，如人馬座星團（M22）和人馬座星雲（M24），使其成為天文攝影的熱門目標。',
        myth: '射手座通常被認為是神話中智慧的半人馬——喀戎的化身。與其他兇猛的半人馬不同，喀戎是一位博學的導師、醫生和預言家，他曾教導過許多希臘英雄，如阿基里斯和赫拉克勒斯。喀戎在一次意外中被赫拉克勒斯的毒箭所傷，因為擁有不死之身而承受著無盡的痛苦。最終，他放棄了自己的永生，將其讓給了普羅米修斯，宙斯因此將他升上天空，成為射手座，以紀念他的智慧和犧牲。',
        source: 'https://www.greekmythology.com/Myths/Zodiac/Sagittarius/sagittarius.html',
        image: 'sagittarius.png'
    },
    'cap': {
        knowledge: '摩羯座是一個相對黯淡的星座，其最亮的星是「壘壁陣四」（Deneb Algedi），視星等為2.81。星座中的「壘壁陣增五」（Dabih）是一個受歡迎的雙星，適合業餘天文學家觀測。摩羯座包含一個球狀星團M30，可以通過小型望遠鏡看到。此外，一個名為HCG 87的緊湊星系群也位於此星座。',
        myth: '摩羯座的形象是“海山羊”，一種上半身是山羊、下半身是魚的奇特生物。這個形象與希臘神話中的牧神潘有關。在一次眾神的宴會上，怪物堤豐突然出現，眾神紛紛變身逃跑。潘神在慌亂中跳入尼羅河，想變成一條魚，但因為太過匆忙，只有浸在水中的下半身變成了魚尾，而上半身還保持著山羊的樣子。宙斯覺得這個形象很有趣，便將其升上天空，成為了摩羯座。',
        source: 'https://www.greekmythology.com/Myths/Zodiac/Capricorn/capricorn.html',
        image: 'capricorn.png'
    },
    'aqr': {
        knowledge: '水瓶座雖然沒有特別明亮的恆星，但擁有幾個著名的深空天體。其最亮的星是「虛宿一」（Sadalsuud）。水瓶座包含三個梅西耶天體：球狀星團M2和M72，以及一個星群M73。此外，兩個著名的行星狀星雲也位於此處：土星狀星雲（NGC 7009）和壯觀的螺旋星雲（Helix Nebula, NGC 7293），後者是離地球最近的行星狀星雲之一。',
        myth: '水瓶座的神話與特洛伊王子伽倪墨得斯有關。伽倪墨得斯是凡間最美的少年，宙斯被他的美貌吸引，於是化身為一隻巨鷹將他擄到奧林匹斯山。在天上，伽倪墨得斯成為了眾神的侍酒官，負責為他們傾倒神酒。他的形象——一個拿著水瓶倒水的少年——便成為了水瓶座。他倒出的水被認為是智慧和靈感的源泉，灑向人間。',
        source: 'https://www.greekmythology.com/Myths/Zodiac/Aquarius/aquarius.html',
        image: 'aquarius.png'
    },
    'psc': {
        knowledge: '雙魚座是一個較為黯淡的星座，其最亮的星「右更二」（Alpherg）的視星等也只有3.63。星座中最著名的天體是梅西耶天體M74，這是一個美麗的正向旋渦星系，但由於其表面亮度較低，觀測起來具有挑戰性。雙魚座在天文學上的另一個重要特徵是，春分點目前正位於此星座內，這是太陽在天球上從南半球移動到北半球時穿過天球赤道的點。',
        myth: '雙魚座的神話與愛神阿佛洛狄忒和她的兒子厄洛斯有關。在一次眾神的宴會上，怪物堤豐突然襲來，眾神紛紛變身逃命。為了逃脫，阿佛洛狄忒和厄洛斯化身為兩條魚，跳入了幼發拉底河。為了在湍急的河水中不失散，他們用一條絲帶將彼此的尾巴綁在了一起。這兩條魚的形象便成為了雙魚座，象徵著愛、團結和在混亂中尋求庇護。',
        source: 'https://www.greekmythology.com/Myths/Zodiac/Pisces/pisces.html',
        image: 'pisces.png'
    }
};


const constellationOrder = ['Ari', 'Tau', 'Gem', 'Cnc', 'Leo', 'Vir', 'Lib', 'Sco', 'Sgr', 'Cap', 'Aqr', 'Psc'];

function processConstellationData(rawData) {
    const processed = {};
    const visualSize = 10;

    rawData.features.forEach(feature => {
        const id = feature.properties.id;
        if (nameMap[id]) {
            const uniqueStarCoords = new Map();
            feature.geometry.coordinates.forEach(line => {
                line.forEach(coord => {
                    let lon = coord[0];
                    if ((id === 'Lib' || id === 'Sco' || id === 'Sgr' || id === 'Cap' || id === 'Aqr' || id === 'Psc') && lon < 0) {
                        lon += 360;
                    }
                    const key = `${lon},${coord[1]}`;
                    if (!uniqueStarCoords.has(key)) {
                        uniqueStarCoords.set(key, { lon: lon, lat: coord[1] });
                    }
                });
            });

            const coords = Array.from(uniqueStarCoords.values());
            if (coords.length === 0) return;

            let minLon = coords[0].lon, maxLon = coords[0].lon;
            let minLat = coords[0].lat, maxLat = coords[0].lat;
            coords.forEach(c => {
                if (c.lon < minLon) minLon = c.lon;
                if (c.lon > maxLon) maxLon = c.lon;
                if (c.lat < minLat) minLat = c.lat;
                if (c.lat > maxLat) maxLat = c.lat;
            });

            const centerLon = (minLon + maxLon) / 2;
            const centerLat = (minLat + maxLat) / 2;
            const spanLon = maxLon - minLon;
            const spanLat = maxLat - minLat;
            const scale = Math.max(spanLon, spanLat, 1);

            const starMap = new Map();
            let starCounter = 0;
            coords.forEach(c => {
                const key = `${c.lon},${c.lat}`;
                const normalizedX = ((c.lon - centerLon) / scale) * visualSize;
                const normalizedY = ((c.lat - centerLat) / scale) * visualSize;
                
                starMap.set(key, {
                    id: `${id.toLowerCase()}-${starCounter++}`,
                    position: [-normalizedX, normalizedY, (Math.random() - 0.5) * 2]
                });
            });

            const stars = Array.from(starMap.values());
            const lines = [];

            feature.geometry.coordinates.forEach(line => {
                for (let i = 0; i < line.length - 1; i++) {
                    let startLon = line[i][0];
                    if ((id === 'Lib' || id === 'Sco' || id === 'Sgr' || id === 'Cap' || id === 'Aqr' || id === 'Psc') && startLon < 0) {
                        startLon += 360;
                    }
                    const startKey = `${startLon},${line[i][1]}`;

                    let endLon = line[i+1][0];
                    if ((id === 'Lib' || id === 'Sco' || id === 'Sgr' || id === 'Cap' || id === 'Aqr' || id === 'Psc') && endLon < 0) {
                        endLon += 360;
                    }
                    const endKey = `${endLon},${line[i+1][1]}`;
                    
                    const startNode = starMap.get(startKey);
                    const endNode = starMap.get(endKey);

                    if (startNode && endNode) {
                        lines.push([startNode.id, endNode.id]);
                    }
                }
            });

            const constellationId = id.toLowerCase();
            processed[id] = {
                id: constellationId,
                name: nameMap[id],
                stars,
                lines,
                ...zodiacDetails[constellationId]
            };
        }
    });

    return constellationOrder.map(id => processed[id]);
}

export const constellationData = processConstellationData(geoJsonData);