import { City } from './types';

// Database organized by "Stages" (Rounds) of the trip.
// Logic:
// Round 1: East Asia / Oceania (East/South of Taiwan)
// Round 2: Pacific / West North America
// Round 3: East North America / South America
// Round 4: Europe / Atlantic
// Round 5: Middle East / Africa
// Round 6: South/West Asia (Returning Loop)

export const TRAVEL_DB: City[][] = [
  // --- Round 1: East Asia & Oceania (12 Cities) ---
  [
    {
      name: "東京", country: "日本", latitude: 35.6, vibe: "urban",
      description: "日本繁忙的首都，融合了超現代的霓虹燈街景與寧靜的傳統神社。這裡是動漫文化、頂級美食與時尚潮流的中心。",
      landmarks: [
        { name: "澀谷十字路口", description: "世界上最繁忙的十字路口，體驗人潮洶湧的震撼。", bestAngle: "高處俯拍" },
        { name: "淺草寺雷門", description: "東京最古老的寺廟，巨大的紅色燈籠是必拍標誌。", bestAngle: "正門前" },
        { name: "東京鐵塔", description: "紅白相間的經典地標，象徵東京的浪漫與歷史。", bestAngle: "芝公園" },
        { name: "明治神宮", description: "位於森林中的莊嚴神社，心靈平靜之地。", bestAngle: "巨大鳥居前" },
        { name: "新宿歌舞伎町", description: "不夜城的霓虹招牌，充滿賽博龐克感。", bestAngle: "哥吉拉飯店下" },
        { name: "晴空塔", description: "世界最高的自立式電波塔，俯瞰東京全景。", bestAngle: "河對岸" }
      ]
    },
    {
      name: "京都", country: "日本", latitude: 35.0, vibe: "historic",
      description: "日本的千年古都，擁有數千座佛教寺廟和神道教神社。這裡是藝妓文化、傳統茶道與四季美景的故鄉。",
      landmarks: [
        { name: "伏見稻荷大社", description: "千本鳥居構成的朱紅色隧道，神秘而壯觀。", bestAngle: "鳥居隧道內" },
        { name: "金閣寺", description: "外牆貼滿金箔的禪寺，倒映在鏡湖池中。", bestAngle: "湖對岸" },
        { name: "清水寺", description: "懸空的木造舞台，可眺望京都市景。", bestAngle: "奧之院平台" },
        { name: "嵐山竹林", description: "高聳入雲的翠綠竹林小徑。", bestAngle: "小徑中央" },
        { name: "祇園花見小路", description: "運氣好能遇見藝妓的古老街道。", bestAngle: "石板路上" }
      ]
    },
    {
      name: "大阪", country: "日本", latitude: 34.6, vibe: "urban",
      description: "日本的廚房，以熱情的當地人、章魚燒與大阪燒聞名。道頓堀的固力果跑跑人是不可錯過的打卡點。",
      landmarks: [
        { name: "道頓堀", description: "巨大的立體招牌與運河夜景。", bestAngle: "戎橋上" },
        { name: "大阪城", description: "豐臣秀吉建造的壯麗城堡。", bestAngle: "天守閣前" },
        { name: "通天閣", description: "充滿懷舊昭和風情的地標塔。", bestAngle: "新世界街道" },
        { name: "環球影城", description: "充滿魔法與冒險的世界級樂園。", bestAngle: "地球儀前" },
        { name: "黑門市場", description: "美食雲集的熱鬧市場。", bestAngle: "海鮮攤位前" }
      ]
    },
    {
      name: "首爾", country: "韓國", latitude: 37.5, vibe: "urban",
      description: "充滿活力的城市，朝鮮王朝的古宮與現代摩天大樓比鄰而居。K-Pop、時尚美妝與韓式烤肉隨處可見。",
      landmarks: [
        { name: "景福宮", description: "朝鮮王朝最壯麗的宮殿，穿韓服免費入場。", bestAngle: "勤政殿前" },
        { name: "N首爾塔", description: "南山山頂的浪漫地標，俯瞰城市燈火。", bestAngle: "愛情鎖牆" },
        { name: "北村韓屋村", description: "保存完好的傳統韓屋聚落。", bestAngle: "上坡巷弄" },
        { name: "東大門設計廣場", description: "充滿未來感的銀色流線型建築。", bestAngle: "建築外觀" },
        { name: "弘大商圈", description: "充滿年輕活力的街頭表演與購物區。", bestAngle: "塗鴉牆前" }
      ]
    },
    {
      name: "釜山", country: "韓國", latitude: 35.1, vibe: "beach",
      description: "韓國最大的港口城市，擁有美麗的海水浴場、色彩繽紛的山坡村落與新鮮的海鮮市場。",
      landmarks: [
        { name: "甘川洞文化村", description: "被稱為韓國的馬丘比丘，彩色房屋遍布山坡。", bestAngle: "小王子雕像旁" },
        { name: "海雲台海水浴場", description: "韓國最著名的白沙灘。", bestAngle: "沙灘上" },
        { name: "廣安大橋", description: "橫跨海面的壯觀大橋，夜景迷人。", bestAngle: "海邊步道" },
        { name: "海東龍宮寺", description: "罕見的建在海邊岩石上的寺廟。", bestAngle: "橋上遠眺" },
        { name: "The Bay 101", description: "拍攝摩天大樓水中倒影的絕佳地點。", bestAngle: "碼頭邊" }
      ]
    },
    {
      name: "上海", country: "中國", latitude: 31.2, vibe: "urban",
      description: "東方的巴黎，外灘的萬國建築博覽群與陸家嘴的超高摩天大樓隔江相望，展現極致的繁華。",
      landmarks: [
        { name: "外灘", description: "欣賞黃浦江對岸天際線的最佳位置。", bestAngle: "觀景平台" },
        { name: "東方明珠塔", description: "獨特球體造型的電視塔。", bestAngle: "陸家嘴圓環" },
        { name: "豫園", description: "明代古典園林，景色秀麗。", bestAngle: "九曲橋" },
        { name: "南京路步行街", description: "十里洋場，繁華的購物街道。", bestAngle: "霓虹燈下" },
        { name: "武康大樓", description: "著名的船型歷史建築。", bestAngle: "路口對角" }
      ]
    },
    {
      name: "雪梨", country: "澳洲", latitude: -33.8, vibe: "beach",
      description: "南半球最璀璨的珍珠，擁有世界級的港灣景觀、標誌性的歌劇院以及陽光普照的衝浪海灘。",
      landmarks: [
        { name: "雪梨歌劇院", description: "表現主義建築的傑作，如風帆般矗立。", bestAngle: "環形碼頭" },
        { name: "雪梨港灣大橋", description: "暱稱「衣架」的巨大鋼鐵拱橋。", bestAngle: "橋下草地" },
        { name: "邦代海灘", description: "衝浪者的天堂，擁有絕美的弧形沙灘。", bestAngle: "泳池俱樂部旁" },
        { name: "達令港", description: "熱鬧的休閒娛樂區。", bestAngle: "海濱長廊" },
        { name: "岩石區", description: "最古老的街區，充滿歷史韻味。", bestAngle: "鵝卵石巷弄" }
      ]
    },
    {
      name: "墨爾本", country: "澳洲", latitude: -37.8, vibe: "urban",
      description: "澳洲的文化與咖啡之都，充滿藝術氣息的塗鴉巷弄、維多利亞式建築與電車穿梭的街道。",
      landmarks: [
        { name: "弗林德斯車站", description: "黃色的宏偉古老車站。", bestAngle: "聯邦廣場對面" },
        { name: "霍西爾巷", description: "充滿街頭塗鴉藝術的著名巷弄。", bestAngle: "塗鴉牆前" },
        { name: "布萊頓海灘", description: "排列著色彩繽紛的彩虹小屋。", bestAngle: "小屋前方" },
        { name: "維多利亞州立圖書館", description: "宏偉的圓頂閱覽室。", bestAngle: "閱覽室高處" },
        { name: "尤利卡大樓", description: "南半球最高的觀景台之一。", bestAngle: "玻璃箱內" }
      ]
    },
    {
      name: "黃金海岸", country: "澳洲", latitude: -28.0, vibe: "beach",
      description: "衝浪者的天堂，綿延數十公里的金色沙灘與高樓大廈緊鄰海岸線，度假氛圍濃厚。",
      landmarks: [
        { name: "衝浪者天堂拱門", description: "海灘入口的著名標誌。", bestAngle: "拱門下方" },
        { name: "Q1大廈", description: "澳洲最高樓，擁有SkyPoint觀景台。", bestAngle: "觀景窗邊" },
        { name: "庫倫賓野生動物園", description: "可以抱無尾熊的地方。", bestAngle: "與無尾熊合照" },
        { name: "伯利角", description: "著名的衝浪點與國家公園。", bestAngle: "岩石上" },
        { name: "華納電影世界", description: "南半球的好萊塢主題樂園。", bestAngle: "大門口" }
      ]
    },
    {
      name: "奧克蘭", country: "紐西蘭", latitude: -36.8, vibe: "nature",
      description: "帆船之都，被死火山口和兩個港灣環繞。這裡是探索紐西蘭壯麗自然景觀的起點。",
      landmarks: [
        { name: "天空塔", description: "南半球最高的獨立建築物。", bestAngle: "塔底仰拍" },
        { name: "伊甸山", description: "市區最高的死火山，擁有巨大火山口。", bestAngle: "火山口邊緣" },
        { name: "懷赫科島", description: "充滿葡萄園與海灘的美麗島嶼。", bestAngle: "葡萄園內" },
        { name: "霍比特人村", description: "電影《魔戒》的拍攝場景（近郊）。", bestAngle: "袋底洞前" },
        { name: "使命灣", description: "風景優美的海濱海灘。", bestAngle: "噴泉旁" }
      ]
    },
    {
      name: "宿霧", country: "菲律賓", latitude: 10.3, vibe: "beach",
      description: "南方皇后市，擁有西班牙殖民歷史遺跡與世界級的潛水勝地，可以與鯨鯊共游。",
      landmarks: [
        { name: "麥哲倫十字架", description: "宿霧最著名的歷史地標。", bestAngle: "八角亭內" },
        { name: "聖嬰大教堂", description: "菲律賓最古老的天主教堂。", bestAngle: "教堂中庭" },
        { name: "奧斯洛布", description: "觀賞鯨鯊的著名景點。", bestAngle: "水下與鯨鯊合影" },
        { name: "嘉華山瀑布", description: "碧藍色的夢幻瀑布。", bestAngle: "竹筏上" },
        { name: "聖佩德羅堡", description: "西班牙殖民時期的軍事堡壘。", bestAngle: "城牆上" }
      ]
    },
    {
      name: "沖繩", country: "日本", latitude: 26.2, vibe: "beach",
      description: "日本的熱帶天堂，擁有獨特的琉球文化、清澈見底的藍色海洋與美軍基地帶來的異國風情。",
      landmarks: [
        { name: "美麗海水族館", description: "擁有巨大黑潮之海槽的水族館。", bestAngle: "巨大水槽前" },
        { name: "首里城", description: "琉球王國的紅色宮殿（重建中）。", bestAngle: "守禮門" },
        { name: "萬座毛", description: "像象鼻一樣的海岸懸崖。", bestAngle: "草坪上" },
        { name: "美國村", description: "充滿美式風情的購物娛樂區。", bestAngle: "摩天輪背景" },
        { name: "古宇利大橋", description: "穿越碧藍大海的絕美大橋。", bestAngle: "沙灘遠眺" }
      ]
    }
  ],
  // --- Round 2: Pacific / West North America ---
  [
    {
      name: "洛杉磯", country: "美國", latitude: 34.0, vibe: "beach",
      description: "天使之城，全球娛樂產業的中心。這裡有好萊塢的星光、聖塔莫尼卡的陽光與比佛利山莊的奢華。",
      landmarks: [
        { name: "好萊塢標誌", description: "山丘上的白色大字，電影夢的象徵。", bestAngle: "好萊塢湖公園" },
        { name: "聖塔莫尼卡碼頭", description: "66號公路的終點，擁有著名的摩天輪。", bestAngle: "沙灘上" },
        { name: "好萊塢星光大道", description: "鑲嵌著名人手印的人行道。", bestAngle: "中國戲院前" },
        { name: "格里斐斯天文台", description: "俯瞰洛杉磯夜景的最佳地點。", bestAngle: "天文台露台" },
        { name: "比佛利山莊", description: "名流雲集的奢華豪宅區。", bestAngle: "羅迪歐大道" },
        { name: "威尼斯海灘", description: "充滿街頭藝人與滑板文化的波西米亞風海灘。", bestAngle: "塗鴉牆" }
      ]
    },
    {
      name: "舊金山", country: "美國", latitude: 37.7, vibe: "urban",
      description: "以陡峭的街道、迷霧、維多利亞式建築和科技創新聞名。這是一座包容且充滿自由氣息的城市。",
      landmarks: [
        { name: "金門大橋", description: "橘紅色的懸索橋，城市的象徵。", bestAngle: "巴克蒂角" },
        { name: "漁人碼頭", description: "熱鬧的港口，可以看到慵懶的海獅。", bestAngle: "39號碼頭" },
        { name: "九曲花街", description: "世界上最彎曲的街道，開滿繡球花。", bestAngle: "街道底部" },
        { name: "惡魔島", description: "曾是聯邦監獄的孤島。", bestAngle: "渡輪上" },
        { name: "藝術宮", description: "羅馬風格的廢墟建築，優雅壯觀。", bestAngle: "池塘對岸" }
      ]
    },
    {
      name: "拉斯維加斯", country: "美國", latitude: 36.1, vibe: "urban",
      description: "沙漠中的娛樂綠洲，以賭場、奢華飯店和世界級的表演秀聞名，真正的罪惡之城。",
      landmarks: [
        { name: "拉斯維加斯大道", description: "霓虹燈閃爍的主幹道。", bestAngle: "貝拉吉奧噴泉前" },
        { name: "歡迎來到拉斯維加斯招牌", description: "著名的菱形霓虹燈招牌。", bestAngle: "招牌正前方" },
        { name: "威尼斯人飯店", description: "重現威尼斯運河與貢多拉。", bestAngle: "室內運河橋上" },
        { name: "弗里蒙特街", description: "老城區的巨型天幕燈光秀。", bestAngle: "街道中央" },
        { name: "豪客摩天輪", description: "世界最高的摩天輪之一。", bestAngle: "車廂內" }
      ]
    },
    {
      name: "西雅圖", country: "美國", latitude: 47.6, vibe: "urban",
      description: "翡翠之城，被常青森林和水域環繞。這裡是星巴克的發源地，也是科技巨頭的總部。",
      landmarks: [
        { name: "太空針塔", description: "未來主義風格的觀景塔。", bestAngle: "克里公園" },
        { name: "派克市場", description: "著名的拋魚秀與第一家星巴克。", bestAngle: "Public Market招牌下" },
        { name: "奇胡利玻璃花園", description: "色彩斑斕的玻璃藝術展。", bestAngle: "溫室內" },
        { name: "口香糖牆", description: "貼滿口香糖的奇特磚牆。", bestAngle: "巷弄內" },
        { name: "雷尼爾山", description: "終年積雪的壯麗火山（天氣好時可見）。", bestAngle: "飛機窗口" }
      ]
    },
    {
      name: "溫哥華", country: "加拿大", latitude: 49.2, vibe: "nature",
      description: "世界上最宜居的城市之一，繁華都市與大自然完美融合，上午滑雪，下午可以去海灘。",
      landmarks: [
        { name: "史丹利公園", description: "北美最大的城市公園之一，擁有圖騰柱。", bestAngle: "海堤步道" },
        { name: "蓋斯鎮", description: "溫哥華的發源地，擁有著名的蒸汽鐘。", bestAngle: "蒸汽鐘旁" },
        { name: "卡皮拉諾吊橋", description: "橫跨雨林峽谷的搖晃吊橋。", bestAngle: "吊橋中央" },
        { name: "加拿大廣場", description: "帆船造型的會議中心。", bestAngle: "濱海步道" },
        { name: "格蘭維爾島", description: "充滿藝術氣息與美食的半島。", bestAngle: "公共市場前" }
      ]
    },
    {
      name: "班夫", country: "加拿大", latitude: 51.1, vibe: "nature",
      description: "位於落基山脈中心，擁有碧綠的湖泊、壯麗的雪山與豐富的野生動物。",
      landmarks: [
        { name: "路易斯湖", description: "碧綠如寶石的高山湖泊。", bestAngle: "飯店前湖畔" },
        { name: "夢蓮湖", description: "被十峰山環繞的絕美湖泊。", bestAngle: "岩石堆頂端" },
        { name: "班夫大街", description: "童話般的山中小鎮街道。", bestAngle: "以雪山為背景" },
        { name: "硫磺山纜車", description: "俯瞰班夫鎮與群山的纜車。", bestAngle: "山頂觀景台" },
        { name: "弓河瀑布", description: "瑪麗蓮夢露電影取景地。", bestAngle: "瀑布邊" }
      ]
    },
    {
      name: "檀香山", country: "美國", latitude: 21.3, vibe: "beach",
      description: "夏威夷的首府，阿羅哈精神的家鄉。這裡有草裙舞、花環、衝浪與永恆的夏日。",
      landmarks: [
        { name: "威基基海灘", description: "世界上最著名的海灘之一，鑽石頭山為背景。", bestAngle: "杜克雕像旁" },
        { name: "珍珠港", description: "二戰歷史紀念地。", bestAngle: "亞利桑那號紀念館" },
        { name: "鑽石頭山", description: "死火山錐，可俯瞰檀香山全景。", bestAngle: "山頂步道" },
        { name: "伊奧拉尼宮", description: "美國唯一的皇宮。", bestAngle: "宮殿大門" },
        { name: "恐龍灣", description: "著名的浮潛勝地。", bestAngle: "半山腰俯瞰" }
      ]
    }
  ],
  // --- Round 3: East North America / South America ---
  [
    {
      name: "紐約", country: "美國", latitude: 40.7, vibe: "urban",
      description: "大蘋果，世界的金融與文化中心。這裡擁有無數的博物館、劇院與標誌性建築。",
      landmarks: [
        { name: "時代廣場", description: "世界的十字路口，被霓虹廣告包圍。", bestAngle: "紅色階梯上" },
        { name: "自由女神像", description: "自由民主的象徵。", bestAngle: "渡輪上" },
        { name: "帝國大廈", description: "曾經的世界最高樓，經典裝飾藝術建築。", bestAngle: "洛克菲勒中心觀景台" },
        { name: "中央公園", description: "曼哈頓中心的巨大綠肺。", bestAngle: "弓橋上" },
        { name: "布魯克林大橋", description: "古老的懸索橋，連接曼哈頓與布魯克林。", bestAngle: "橋中央" },
        { name: "華爾街", description: "世界金融中心。", bestAngle: "銅牛雕像旁" }
      ]
    },
    {
      name: "多倫多", country: "加拿大", latitude: 43.6, vibe: "urban",
      description: "加拿大最大的城市，多元文化的熔爐，坐落在安大略湖畔。",
      landmarks: [
        { name: "加拿大國家電視塔", description: "曾經的世界最高塔，多倫多天際線主角。", bestAngle: "羅傑斯中心旁" },
        { name: "瑞普利水族館", description: "擁有巨大水下隧道的水族館。", bestAngle: "隧道內" },
        { name: "皇家安大略博物館", description: "水晶造型的獨特建築。", bestAngle: "建築轉角" },
        { name: "聖勞倫斯市場", description: "美食雲集的古老市場。", bestAngle: "市場內部" },
        { name: "多倫多群島", description: "欣賞城市天際線的最佳地點。", bestAngle: "渡輪上" }
      ]
    },
    {
      name: "墨西哥城", country: "墨西哥", latitude: 19.4, vibe: "historic",
      description: "建立在阿茲特克遺跡上的巨大都市，充滿色彩、歷史與辛辣的美食。",
      landmarks: [
        { name: "憲法廣場", description: "美洲最大的廣場之一，周圍是主教堂。", bestAngle: "廣場中央" },
        { name: "特奧蒂瓦坎", description: "壯觀的太陽金字塔與月亮金字塔（近郊）。", bestAngle: "太陽金字塔頂" },
        { name: "國家宮", description: "擁有迪亞哥·里維拉的巨幅壁畫。", bestAngle: "壁畫前" },
        { name: "索馬亞博物館", description: "閃閃發光的銀色流線型建築。", bestAngle: "建築外部" },
        { name: "霍奇米爾科", description: "色彩繽紛的運河與遊船。", bestAngle: "彩色船上" }
      ]
    },
    {
      name: "坎昆", country: "墨西哥", latitude: 21.1, vibe: "beach",
      description: "加勒比海的度假天堂，擁有潔白的沙灘、碧藍的海水與神秘的馬雅遺跡。",
      landmarks: [
        { name: "奇琴伊察", description: "世界新七大奇蹟之一的馬雅金字塔。", bestAngle: "羽蛇神金字塔前" },
        { name: "海豚海灘", description: "有著CANCUN彩色大字的必拍海灘。", bestAngle: "地標字前" },
        { name: "女人島", description: "風景優美的度假小島。", bestAngle: "高爾夫球車上" },
        { name: "圖盧姆遺跡", description: "建在海邊懸崖上的馬雅古城。", bestAngle: "懸崖邊" },
        { name: "天然井", description: "神秘的地下石灰岩洞穴泳池。", bestAngle: "跳水台" }
      ]
    },
    {
      name: "里約熱內盧", country: "巴西", latitude: -22.9, vibe: "beach",
      description: "上帝之城，擁有世界上最壯觀的自然景觀與城市融合，森巴舞與嘉年華的故鄉。",
      landmarks: [
        { name: "救世基督像", description: "科科瓦多山頂的巨型耶穌像。", bestAngle: "張開雙臂模仿" },
        { name: "糖麵包山", description: "巨大的花崗岩圓頂山。", bestAngle: "纜車窗邊" },
        { name: "科帕卡巴納海灘", description: "著名的彎月形沙灘。", bestAngle: "波浪紋人行道" },
        { name: "塞拉隆階梯", description: "色彩繽紛的磁磚階梯。", bestAngle: "階梯底部" },
        { name: "馬拉卡納體育場", description: "足球聖地。", bestAngle: "球場內" }
      ]
    },
    {
      name: "庫斯科", country: "秘魯", latitude: -13.5, vibe: "historic",
      description: "印加帝國的古都，安地斯山脈中的寶石，通往天空之城馬丘比丘的門戶。",
      landmarks: [
        { name: "馬丘比丘", description: "失落的印加城市，世界新七大奇蹟。", bestAngle: "經典明信片角度" },
        { name: "武器廣場", description: "殖民風格的中心廣場。", bestAngle: "大教堂前" },
        { name: "薩克賽瓦曼", description: "巨石堆砌的神秘堡壘。", bestAngle: "巨石牆前" },
        { name: "十二角石", description: "印加石砌工藝的極致。", bestAngle: "石頭特寫" },
        { name: "彩虹山", description: "擁有七彩條紋的丹霞地貌。", bestAngle: "山頂步道" }
      ]
    },
    {
      name: "布宜諾斯艾利斯", country: "阿根廷", latitude: -34.6, vibe: "urban",
      description: "南美洲的巴黎，充滿優雅的歐式建築、熱情的探戈與美味的牛排。",
      landmarks: [
        { name: "方尖碑", description: "七月九日大道上的巨大地標。", bestAngle: "大道中央" },
        { name: "博卡區", description: "色彩鮮豔的鐵皮屋與街頭探戈。", bestAngle: "Caminito街" },
        { name: "雅典人書店", description: "劇院改建的華麗書店。", bestAngle: "包廂俯拍" },
        { name: "五月廣場", description: "阿根廷政治的心臟。", bestAngle: "玫瑰宮前" },
        { name: "女人橋", description: "造型優美的白色斜拉橋。", bestAngle: "馬德羅港邊" }
      ]
    }
  ],
  // --- Round 4: Europe (Atlantic Side) ---
  [
    {
      name: "倫敦", country: "英國", latitude: 51.5, vibe: "cold",
      description: "大英帝國的首都，歷史與現代完美融合，擁有皇室風情與頂尖的博物館。",
      landmarks: [
        { name: "大笨鐘", description: "伊麗莎白塔，倫敦的象徵。", bestAngle: "西敏橋上" },
        { name: "倫敦塔橋", description: "泰晤士河上的華麗吊橋。", bestAngle: "河岸邊" },
        { name: "倫敦眼", description: "巨大的觀景摩天輪。", bestAngle: "對岸取景" },
        { name: "白金漢宮", description: "英國皇室的居所。", bestAngle: "維多利亞女王紀念碑" },
        { name: "大英博物館", description: "收藏世界珍寶的博物館。", bestAngle: "玻璃穹頂下" },
        { name: "國王十字車站", description: "9又3/4月台所在地。", bestAngle: "推車造景處" }
      ]
    },
    {
      name: "巴黎", country: "法國", latitude: 48.8, vibe: "urban",
      description: "光之城，浪漫、藝術與時尚的代名詞。在塞納河畔漫步是人生必做的清單。",
      landmarks: [
        { name: "艾菲爾鐵塔", description: "浪漫的鋼鐵巨塔。", bestAngle: "夏樂宮廣場" },
        { name: "羅浮宮", description: "蒙娜麗莎的家。", bestAngle: "玻璃金字塔" },
        { name: "凱旋門", description: "拿破崙的勝利紀念碑。", bestAngle: "香榭麗舍大道中軸" },
        { name: "聖母院", description: "哥德式建築的傑作。", bestAngle: "塞納河遊船上" },
        { name: "蒙馬特", description: "藝術家聚集的山丘。", bestAngle: "聖心堂前" },
        { name: "奧賽博物館", description: "舊火車站改建的印象派殿堂。", bestAngle: "大時鐘後" }
      ]
    },
    {
      name: "羅馬", country: "義大利", latitude: 41.9, vibe: "historic",
      description: "永恆之城，整座城市就是一座巨大的露天博物館，隨處可見千年的遺跡。",
      landmarks: [
        { name: "羅馬競技場", description: "古羅馬神鬼戰士決鬥的地方。", bestAngle: "外牆拱門處" },
        { name: "許願池", description: "巴洛克風格的華麗噴泉。", bestAngle: "噴泉正前方" },
        { name: "西班牙階梯", description: "電影《羅馬假期》的經典場景。", bestAngle: "階梯下方" },
        { name: "萬神殿", description: "擁有巨大圓頂的古羅馬神廟。", bestAngle: "神廟廣場" },
        { name: "梵蒂岡聖彼得大教堂", description: "世界最大的教堂。", bestAngle: "聖彼得廣場" },
        { name: "真理之口", description: "測謊的石雕面具。", bestAngle: "手伸進口中" }
      ]
    },
    {
      name: "巴塞隆納", country: "西班牙", latitude: 41.3, vibe: "urban",
      description: "高第的城市，充滿奇幻的建築、地中海的陽光與美味的塔帕斯(Tapas)。",
      landmarks: [
        { name: "聖家堂", description: "高第未完成的鉅作，像森林般的教堂。", bestAngle: "誕生立面池塘對岸" },
        { name: "奎爾公園", description: "充滿馬賽克拼貼的童話公園。", bestAngle: "波浪長椅" },
        { name: "巴特婁之家", description: "龍脊造型屋頂的奇特建築。", bestAngle: "格拉西亞大道上" },
        { name: "蘭布拉大道", description: "熱鬧的步行街。", bestAngle: "波蓋利亞市場入口" },
        { name: "米拉之家", description: "外星人煙囪造型的屋頂。", bestAngle: "屋頂露台" }
      ]
    },
    {
      name: "雷克雅維克", country: "冰島", latitude: 64.1, vibe: "cold",
      description: "冰與火之國的首都，追逐極光、探索冰川與火山的起點。",
      landmarks: [
        { name: "哈爾格林姆教堂", description: "像玄武岩柱一樣高聳的教堂。", bestAngle: "教堂正門" },
        { name: "藍湖溫泉", description: "奶藍色的夢幻地熱溫泉。", bestAngle: "溫泉水中" },
        { name: "太陽航海者", description: "維京船骨架雕塑。", bestAngle: "海濱步道" },
        { name: "哈帕音樂廳", description: "蜂巢狀玻璃外觀的建築。", bestAngle: "建築內部光影" },
        { name: "鑽石沙灘", description: "散落著晶瑩剔透冰塊的黑沙灘（近郊）。", bestAngle: "透過冰塊拍夕陽" }
      ]
    },
    {
      name: "阿姆斯特丹", country: "荷蘭", latitude: 52.3, vibe: "urban",
      description: "運河之都，以腳踏車、鬱金香、自由的風氣與古老的紅磚建築聞名。",
      landmarks: [
        { name: "水壩廣場", description: "城市的中心廣場。", bestAngle: "皇宮前" },
        { name: "國家博物館", description: "收藏倫勃朗名畫的宏偉建築。", bestAngle: "I amsterdam標誌（如下落不明則拍建築）" },
        { name: "安妮之家", description: "二戰歷史見證地。", bestAngle: "運河對岸" },
        { name: "海尼根體驗館", description: "啤酒迷的朝聖地。", bestAngle: "啤酒牆" },
        { name: "紅燈區", description: "夜晚燈紅酒綠的獨特街區。", bestAngle: "運河橋上（注意隱私）" }
      ]
    },
    {
      name: "聖托里尼", country: "希臘", latitude: 36.3, vibe: "beach",
      description: "愛琴海上的藍白天堂，擁有世界上最美的夕陽。",
      landmarks: [
        { name: "伊亞小鎮", description: "藍頂教堂與白色小屋的經典畫面。", bestAngle: "碉堡觀景台" },
        { name: "藍頂教堂", description: "國家地理雜誌封面景點。", bestAngle: "上方步道俯拍" },
        { name: "紅沙灘", description: "紅色的火山岩沙灘。", bestAngle: "懸崖邊" },
        { name: "費拉", description: "懸崖邊的熱鬧首府。", bestAngle: "驢子大道" },
        { name: "亞特蘭蒂斯書店", description: "世界最美書店之一。", bestAngle: "書店露台" }
      ]
    }
  ],
  // --- Round 5: Middle East / Africa ---
  [
    {
      name: "開羅", country: "埃及", latitude: 30.0, vibe: "historic",
      description: "千塔之城，混亂與古老文明並存，尼羅河孕育了偉大的歷史。",
      landmarks: [
        { name: "吉薩金字塔", description: "唯一現存的古代世界七大奇蹟。", bestAngle: "騎駱駝遠眺" },
        { name: "人面獅身像", description: "守護法老陵墓的神獸。", bestAngle: "錯位接吻照" },
        { name: "埃及博物館", description: "收藏圖坦卡門黃金面具的寶庫。", bestAngle: "正門口" },
        { name: "哈利利市集", description: "迷宮般的中世紀伊斯蘭市集。", bestAngle: "燈籠店" },
        { name: "薩拉丁城堡", description: "俯瞰開羅全景的古堡。", bestAngle: "清真寺中庭" }
      ]
    },
    {
      name: "杜拜", country: "阿聯酋", latitude: 25.2, vibe: "urban",
      description: "沙漠中的奇蹟，不斷挑戰世界第一，奢華、未來感與購物的天堂。",
      landmarks: [
        { name: "哈里發塔", description: "高聳入雲的世界最高建築。", bestAngle: "杜拜噴泉旁" },
        { name: "帆船飯店", description: "七星級的極致奢華象徵。", bestAngle: "朱美拉公共海灘" },
        { name: "杜拜相框", description: "巨大的金色相框建築。", bestAngle: "扎比爾公園" },
        { name: "未來博物館", description: "鏤空書法的環形建築，被譽為最美建築。", bestAngle: "正前方" },
        { name: "棕櫚島亞特蘭蒂斯", description: "巨大的人工島飯店。", bestAngle: "輕軌上" }
      ]
    },
    {
      name: "伊斯坦堡", country: "土耳其", latitude: 41.0, vibe: "historic",
      description: "橫跨歐亞兩洲的城市，融合了拜占庭與鄂圖曼帝國的輝煌歷史。",
      landmarks: [
        { name: "聖索菲亞大教堂", description: "巨大的圓頂與基督教伊斯蘭教融合的奇蹟。", bestAngle: "蘇丹艾哈邁德廣場" },
        { name: "藍色清真寺", description: "擁有六根宣禮塔的優美建築。", bestAngle: "中庭拱門" },
        { name: "大巴扎", description: "世界上最大的室內市集之一。", bestAngle: "彩繪盤子店" },
        { name: "加拉達塔", description: "俯瞰金角灣的中世紀石塔。", bestAngle: "塔下街道" },
        { name: "博斯普魯斯海峽", description: "分隔歐亞的藍色水道。", bestAngle: "遊船上" }
      ]
    },
    {
      name: "佩特拉", country: "約旦", latitude: 30.3, vibe: "historic",
      description: "玫瑰古城，在岩石中雕鑿出的神秘城市，印第安納瓊斯的探險地。",
      landmarks: [
        { name: "卡茲尼神殿", description: "峽谷盡頭的壯麗神殿。", bestAngle: "蛇道出口" },
        { name: "修道院", description: "比神殿更巨大、位於山頂的建築。", bestAngle: "對面山丘" },
        { name: "蛇道", description: "通往古城的狹窄峽谷通道。", bestAngle: "通道中央" },
        { name: "皇家陵墓", description: "巨大的岩石陵墓群。", bestAngle: "陵墓前方" },
        { name: "祭壇", description: "古老的獻祭場所，視野遼闊。", bestAngle: "懸崖邊" }
      ]
    },
    {
      name: "開普敦", country: "南非", latitude: -33.9, vibe: "nature",
      description: "非洲最美的城市，背靠桌山，面對大西洋，擁有豐富的生態與美酒。",
      landmarks: [
        { name: "桌山", description: "上帝的餐桌，平坦的山頂。", bestAngle: "布魯堡海灘" },
        { name: "博卡普", description: "色彩繽紛的馬來區房子。", bestAngle: "Wale Street" },
        { name: "博爾德斯海灘", description: "可以近距離看到野生企鵝。", bestAngle: "木棧道上" },
        { name: "好望角", description: "非洲大陸西南端的著名地標。", bestAngle: "燈塔步道" },
        { name: "維多利亞港", description: "熱鬧的港口購物區。", bestAngle: "摩天輪前" }
      ]
    },
    {
      name: "馬拉喀什", country: "摩洛哥", latitude: 31.6, vibe: "historic",
      description: "紅城，充滿異國情調的露天市集、弄蛇人與華麗的宮殿。",
      landmarks: [
        { name: "傑馬艾夫納廣場", description: "越夜越熱鬧的不眠廣場。", bestAngle: "咖啡廳露台" },
        { name: "馬若雷勒花園", description: "YSL大師深愛的藍色花園。", bestAngle: "藍色別墅前" },
        { name: "庫圖比亞清真寺", description: "城市最高的宣禮塔。", bestAngle: "花園水池旁" },
        { name: "巴伊亞宮", description: "華麗的馬賽克與雕刻宮殿。", bestAngle: "中庭花園" },
        { name: "阿里班約瑟夫神學院", description: "精緻繁複的伊斯蘭建築。", bestAngle: "中庭水池" }
      ]
    }
  ],
  // --- Round 6: South/West Asia (Returning to Taiwan's West) ---
  [
    {
      name: "曼谷", country: "泰國", latitude: 13.7, vibe: "urban",
      description: "天使之城，街頭美食的天堂，擁有金碧輝煌的寺廟與瘋狂的夜生活。",
      landmarks: [
        { name: "鄭王廟", description: "湄南河畔潔白的佛塔，被稱為泰國艾菲爾鐵塔。", bestAngle: "河對岸夕陽" },
        { name: "大皇宮", description: "金光閃閃的皇家建築群。", bestAngle: "玉佛寺前" },
        { name: "水上市場", description: "乘船體驗傳統交易。", bestAngle: "長尾船上" },
        { name: "考山路", description: "背包客的聚集地，充滿活力。", bestAngle: "麥當勞叔叔旁" },
        { name: "Mahanakhon", description: "像像素方塊剝落的摩天大樓。", bestAngle: "玻璃天空步道" }
      ]
    },
    {
      name: "新加坡", country: "新加坡", latitude: 1.3, vibe: "urban",
      description: "花園城市，融合了華人、馬來與印度文化，乾淨、現代且充滿綠意。",
      landmarks: [
        { name: "濱海灣金沙", description: "著名的船型屋頂飯店。", bestAngle: "魚尾獅公園" },
        { name: "超級樹", description: "濱海灣花園的巨型人造樹，夜景迷人。", bestAngle: "空中步道" },
        { name: "星耀樟宜", description: "擁有世界最大的室內瀑布。", bestAngle: "瀑布正前方" },
        { name: "牛車水", description: "充滿歷史色彩的唐人街。", bestAngle: "佛牙寺前" },
        { name: "哈芝巷", description: "色彩繽紛的塗鴉與文創小店。", bestAngle: "塗鴉牆" }
      ]
    },
    {
      name: "香港", country: "中國", latitude: 22.3, vibe: "urban",
      description: "東方之珠，擁有世界三大夜景之一，密集的摩天大樓與懷舊的叮叮車並存。",
      landmarks: [
        { name: "維多利亞港", description: "欣賞璀璨天際線與幻彩詠香江。", bestAngle: "尖沙咀海旁" },
        { name: "太平山頂", description: "俯瞰高樓林立的香港全景。", bestAngle: "凌霄閣" },
        { name: "怪獸大廈", description: "密密麻麻的巨型住宅群，電影《變形金剛》場景。", bestAngle: "天井仰拍" },
        { name: "彩虹邨", description: "色彩繽紛如彩虹般的公共屋邨。", bestAngle: "球場中央" },
        { name: "中環石板街", description: "充滿懷舊氣息的陡峭街道。", bestAngle: "街道下坡處" }
      ]
    },
    {
      name: "清邁", country: "泰國", latitude: 18.7, vibe: "historic",
      description: "泰北玫瑰，充滿古城牆、寺廟與悠閒的文青氣息，是大象的友善家園。",
      landmarks: [
        { name: "塔佩門", description: "古城的紅磚城門，鴿子聚集。", bestAngle: "城門前與鴿子" },
        { name: "雙龍寺", description: "素帖山上的金燦燦寺廟。", bestAngle: "觀景台俯瞰" },
        { name: "白廟", description: "清萊宛如天堂般的純白寺廟（一日遊）。", bestAngle: "奈何橋前" },
        { name: "帕辛寺", description: "清邁地位最高的寺廟。", bestAngle: "大殿前" },
        { name: "寧曼路", description: "充滿咖啡廳與文創小店的街區。", bestAngle: "特色店門口" }
      ]
    },
    {
      name: "胡志明市", country: "越南", latitude: 10.8, vibe: "urban",
      description: "昔日的西貢，充滿法式殖民風情建築、摩托車大軍與美味的河粉。",
      landmarks: [
        { name: "粉紅教堂", description: "少女心爆發的粉紅色耶穌聖心堂。", bestAngle: "馬路對面" },
        { name: "咖啡公寓", description: "整棟老舊公寓改建成風格各異的咖啡廳。", bestAngle: "建築正面" },
        { name: "中央郵局", description: "法式古典風格的百年郵局。", bestAngle: "內部大廳" },
        { name: "濱城市場", description: "熱鬧的傳統市場。", bestAngle: "正門鐘樓" },
        { name: "范五老街", description: "越夜越美麗的酒吧街。", bestAngle: "街頭板凳" }
      ]
    },
    {
      name: "吉隆坡", country: "馬來西亞", latitude: 3.1, vibe: "urban",
      description: "多元種族融合的都市，擁有世界最高的雙塔樓與壯觀的石灰岩洞穴。",
      landmarks: [
        { name: "雙子星塔", description: "世界最高的雙塔建築，銀色外觀極具未來感。", bestAngle: "KLCC公園噴泉" },
        { name: "黑風洞", description: "巨大的石灰岩洞穴與彩色階梯。", bestAngle: "階梯底部" },
        { name: "獨立廣場", description: "殖民風格建築與大草坪。", bestAngle: "蘇丹阿都沙末大廈前" },
        { name: "粉紅清真寺", description: "位於水上的粉紅色清真寺（布城）。", bestAngle: "湖對岸" },
        { name: "亞羅街", description: "著名的美食夜市。", bestAngle: "大排檔中" }
      ]
    }
  ]
];