-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2022-07-11 09:39:56
-- 伺服器版本： 10.4.24-MariaDB
-- PHP 版本： 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `injoin_db`
--

-- --------------------------------------------------------

--
-- 資料表結構 `prd_list`
--

DROP TABLE IF EXISTS `prd_list`;
CREATE TABLE `prd_list` (
  `id` int(3) UNSIGNED NOT NULL,
  `prd_num` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `main_img` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` float UNSIGNED NOT NULL DEFAULT 5,
  `price` int(5) NOT NULL,
  `disc` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `disc_img` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inventory_quantity` int(4) NOT NULL,
  `sale_quantity` int(6) NOT NULL DEFAULT 0,
  `category` int(3) NOT NULL,
  `status` int(1) NOT NULL,
  `create_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `prd_list`
--

INSERT INTO `prd_list` (`id`, `prd_num`, `name`, `main_img`, `rate`, `price`, `disc`, `disc_img`, `inventory_quantity`, `sale_quantity`, `category`, `status`, `create_time`) VALUES
(1, 'AV45', '雪松菓伏特加', '1657183178027.jpg', 5, 500, '純淨的空氣，數百公里的原始針葉林和廣大西伯利亞 - 我們從那裡取得一切製作雪松菓伏特加的原料。釀造雪松菓，我們使用優質酒精，天然水和雪松堅果萃取液，再經由雪松煤過濾以提煉額外的純淨的味道。', NULL, 999, 0, 1, 1, '2022-07-07 16:39:38'),
(2, 'AV13', '灰雁', '1657183798985.jpg', 5, 1150, '源自於法國中心Massif Central Mountains\"，並流經干邑區的自然泉水，經過香檳區石灰層的自然過濾，呈現其無與倫比的自然純淨，在 Grey Goose 酒窖調酒師，\"maitre de chai\"(cellar master)的監製下加入最自然純淨的泉水，使 Grey Goose 達到最佳的濃度與口味。', NULL, 999, 0, 1, 1, '2022-07-07 16:49:58'),
(3, 'AV18', '雪樹伏特加', '1657187491197.jpg', 5, 1150, 'Belvedere Orange Vodka 雪樹伏特加以波蘭歷史上著名的皇家宮殿Belvedere House在雪樹中的美景為瓶身設計，口感濃郁細緻，如絲般順滑，隱約散發香草芬芳。', NULL, 999, 0, 1, 1, '2022-07-07 17:51:31'),
(4, 'AV19A', '思美洛夫藍牌', '1657333860657.jpg', 5, 650, '經過三次蒸餾和十次通過過濾，以提供最大的純度和出色的柔滑度。', NULL, 99, 0, 1, 1, '2022-07-09 10:31:00'),
(5, 'AV36', '	 水晶骷髏伏特加', '1657334033926.jpg', 5, 1980, '水晶頭伏特加採用加拿大芬蘭原始海岸冰川蓄水，經5次蒸餾而成。\r\n其中，在經過第四次和第五次蒸餾時，其液體還滲過赫基蒙（Herkimer）水晶，更增添了該款酒的奢華韻味。', NULL, 1, 0, 1, 1, '2022-07-09 10:33:53'),
(6, 'AV72', '紫天鵝（西洋李伏特加）', '1657334560083.jpg', 5, 1480, '調味伏特加', NULL, 9, 0, 1, 1, '2022-07-09 10:42:40'),
(7, 'AV29A', '帆船鱘龍魚', '1657334798985.jpg', 5, 1980, '四道過濾、酒液靜置45天\r\n使用BELUGA傳統的大麥麥芽和野草莓萃取物，使這瓶伏特加酒更滑順、純淨，帶有柑橘香和輕微甘草香的優雅口感', NULL, 9, 0, 1, 1, '2022-07-09 10:46:38'),
(8, 'AG21', '坦奎利十號', '1657335109838.jpg', 5, 980, '坦奎瑞琴酒自1830年推出以來，就被公認是“唯一”的高級琴酒，至今仍是全球各地頂尖調酒師傅心目中最卓越的琴酒。', NULL, 9, 0, 1, 1, '2022-07-09 10:51:49'),
(9, 'AG62', '蘭森老湯姆琴酒', '1657335462338.jpg', 5, 1550, '以白蘭地蒸餾器蒸餾的麥芽新酒為基底，\r\n調和浸泡了杜松子、橘皮、檸檬皮、芫荽子、當歸根和小荳蔻的玉米基底中性烈酒，\r\n再於白蘭地蒸餾器蒸餾一次後，於法國橡木桶中陳放3-6個月而成。', NULL, 9, 0, 1, 1, '2022-07-09 10:57:42'),
(10, 'AG71', '茉菲琴酒', '1657335745156.jpg', 5, 1200, 'Malfy Gin con Limone是用意大利西西里島曬過的檸檬和六種植物蒸餾而成的。', NULL, 9, 0, 1, 1, '2022-07-09 11:02:25'),
(11, 'AG79A', '阿夸維特', '1657336329749.jpg', 5, 1650, '幾個世紀以來，這種酒是北歐文化不可或缺的一部分。它甚至有自己的歐盟法律：酒精含量 37.5% 以上（通常是 40% 為標準），主要香料是葛縷子或者蒔蘿的酒，才可以稱作阿夸維特。', NULL, 9, 0, 1, 1, '2022-07-09 11:12:09'),
(12, 'AG70R', '和美人大馬士革玫瑰琴酒', '1657336695225.jpg', 5, 1400, '來自日本鹿兒島的津貫蒸餾所，以當地傳統燒酎技術釀造，除了添加杜松子，還運用鹿兒島有機種植的綠茶、生薑、紫蘇，以及當地所產的大馬士革玫瑰原料獨家蒸餾調和而成。', NULL, 5, 0, 1, 1, '2022-07-09 11:18:15'),
(13, 'AR15', '百家得（白）', '1657338021651.jpg', 5, 480, '創立西元1862年，是第一位將木炭過濾法應用於蘭姆酒的釀造先鋒。\r\n所謂的木炭過濾法，是將不同的木材燒煉成炭，這種炭的特色是具有精密程度不一的密度孔隙，可以將蘭姆酒半成品中的雜質完全濾淨，並為其留下最後的芳香口感。', NULL, 9, 0, 1, 1, '2022-07-09 11:40:21'),
(14, 'AR31', '麥爾斯深色蘭姆酒 ', '1657338351719.jpg', 5, 420, '是一款牙買加蘭姆酒，在雞尾酒中為很好的基酒。以1879年創建該品牌的Fred L Myers命名。它混合了9種不同的蘭姆酒。', NULL, 9, 0, 1, 1, '2022-07-09 11:45:51'),
(15, 'AR55', '波多黎各DON Q 151 蘭姆酒', '1657338623074.jpg', 5, 1000, 'Don Q 151°過高蘭姆酒是一種烈酒，帶有金色和淡紅色的反射。蘭姆酒獨特而熾熱的味道背後是蒸餾的糖蜜的蒸餾，並在美國白橡木桶中熟化了三年，因此可以完美地散發出香氣。', NULL, 5, 0, 1, 1, '2022-07-09 11:50:23'),
(16, 'AR53', '美國安迪花神蘭姆酒 ', '1657338907321.jpg', 5, 1550, '「花神」蘭姆酒原料取自於加勒比海周圍盛產的甘蔗，以與不漂白、少精 煉的甘蔗原糖與黑糖蜜製成的自家白蘭姆酒為基酒，浸泡來自牙買加最天然的 洛神花乾，使酒液在帶有洛神花獨特芳香的同時染上了天然的艷麗的紅色。', NULL, 9, 0, 1, 1, '2022-07-09 11:55:07'),
(17, 'AR14D', '薩凱帕 Ambar12', '1657339118432.jpg', 5, 1250, '具有獨特的薩凱帕特色，但酒體更輕，僅帶有一點甜味和辛香味 ，提供了精緻的平衡，使其成為混合和雞尾酒的最佳品嚐蘭姆酒。', NULL, 9, 0, 1, 1, '2022-07-09 11:58:38'),
(18, 'AR40A', '亞瓜拉巴西甘蔗酒', '1657339337882.jpg', 5, 980, '甘蔗酒是在巴西極為風行且受歡迎的傳統飲品，擁有引人注目的瓶身與有機內容物，富有青草、柑橘及入袋水果的芬芳，喚起人們對於巴西甘蔗田的遐想。', NULL, 3, 0, 1, 1, '2022-07-09 12:02:17'),
(19, 'AT17S', '小培恩Silver', '1657340340190.jpg', 5, 850, '以百分百藍色龍舌蘭釀製。這款如水晶般清澈的龍舌蘭酒，帶有新鮮龍舌蘭香氣以及淡淡柑橘氣息，深受全世界龍舌蘭酒鑑賞家喜愛，同時也是許多調酒完美的基酒選擇。', NULL, 3, 0, 1, 1, '2022-07-09 12:19:00'),
(20, 'AT11B', '希瑪竇（金）', '1657340628402.jpg', 5, 800, '一般只要原料中含51％以上的龍舌蘭即可標示為Tequila，但希瑪竇堅持100％以龍舌蘭為原料製作，絕對的濃、醇、香，至今已是墨西哥當地銷量第一的龍舌蘭。', NULL, 9, 0, 1, 1, '2022-07-09 12:23:48'),
(21, 'AT15A', '唐胡立歐Blanco', '1657340809374.jpg', 5, 1800, 'Don JulioDon Julio Gonzalez Estrada這個品牌，以其創辦人來命名的這隻酒，是墨西哥龍舌蘭酒的頂尖，胡立歐先生規範原料必需用100%的Agave，在墨西哥當地生產及蒸餾，淡淡的柑橘香，些許黑胡椒味和麥芽香帶出清新、不甜的溫和口感。', NULL, 3, 0, 1, 1, '2022-07-09 12:26:49'),
(22, 'AT15B', '唐胡立歐Reposado', '1657340940075.jpg', 5, 2000, '在小型的波本桶裡放八個月，色淡而帶著梨子、蘋果、檸檬、香草和巧克力的香味，具有木質和乾果香味的柔順口感。', NULL, 3, 0, 1, 1, '2022-07-09 12:29:00'),
(23, 'AT15D', '唐胡立歐 1942', '1657341152393.jpg', 5, 5480, '於60週年之際特別發行了一款唐胡立歐Don Julio 1942頂級龍舌蘭酒款，此酒以人工挑選藍龍舌蘭植物，蒸餾後熟成於美國白橡木桶長達30個月(一般Angjo等級僅18個月)，而且每一批次製作僅能完成3桶產量！', NULL, 3, 0, 1, 1, '2022-07-09 12:32:32'),
(24, 'AM04', '蒙地亞蘭 王蟲 ', '1657341328330.jpg', 5, 650, 'MAYA勇士不死傳說:馬雅（MAYA）族利用龍舌蘭汁經發酵後製造出來的龍舌蘭酒，經常被用來作為宗教信仰用途。', NULL, 9, 0, 1, 1, '2022-07-09 12:35:28'),
(25, 'AB14', '皮耶費朗三星干邑白蘭地', '1657341637574.jpg', 5, 1780, '這是一款有別於其他品牌以及你印象中的干邑，葡萄香甜立體的風味是最令人眼睛一亮的印象，西洋梨、柑橘、紫羅蘭、橡木、荳蔻等，各式花果甜香與辛香料綻放卻又香甜滑順，加顆冰塊，香甜更飽滿，卻無負擔，干邑白蘭地也能有這樣迷人的表現！', NULL, 3, 0, 1, 1, '2022-07-09 12:40:37'),
(26, 'ABC06', '萊爾德100蘋果白蘭地 ', '1657341777634.jpg', 5, 1550, '這款 Laird‘s 使用 100% apple brandy，放置烤過橡木桶陳年至少 4 年以上，然後裝瓶於 100 proof。完美結合烤過蘋果、香料、木桶香氣，這瓶 Apple Brandy 表現出傳統蘋果白蘭地的全貌。', NULL, 3, 0, 1, 1, '2022-07-09 12:42:57'),
(27, 'ABP07I', ' 波頓皮斯可．綠（義大利亞）', '1657342012866.jpg', 5, 1350, 'Pisco 在此歸類中是最優雅的一種酒，因為 Pisco 只採用整顆葡萄去發酵蒸餾，相當於拿葡萄酒去蒸餾成烈酒。', NULL, 3, 0, 1, 1, '2022-07-09 12:46:52'),
(28, 'AWR02', '酩帝 裸麥威士忌', '1657509231050.jpg', 5, 1950, '酩帝單桶裸麥威士忌由精選的美國黑麥穀物製成，經過剪切後可最大限度地從穀物中提取風味。', NULL, 9, 0, 1, 1, '2022-07-11 11:13:51'),
(29, 'AWB18', '1776 波本威士忌', '1657509462807.jpg', 5, 1480, '濃郁的波本香氣與甜味，再加上裸麥特有的特色，香草、蜂蜜、巧克力、荳蔻等多層次等風味。', NULL, 9, 0, 1, 1, '2022-07-11 11:17:42'),
(30, 'F1504Q', '酩帝 Sour Mash威士忌', '1657509611634.jpg', 5, 1950, '此酒款命名來自威士忌獨特釀造工法，Michter’s酩帝威士忌的首款酸麥芽威士忌自70年代推出，便成為酒廠最受歡迎的酒款之一。', NULL, 9, 0, 1, 1, '2022-07-11 11:20:11'),
(31, 'AWD08', '約翰走路黑標', '1657510019666.jpg', 5, 780, 'JOHNNIE WALKER「黑牌」威士忌深邃、複雜，由40多種不同地區的蘇格蘭威士忌調配而成，每種威士忌都至少在橡木桶中陳年超過12年。', NULL, 9, 0, 1, 1, '2022-07-11 11:26:59'),
(32, 'AWD25', '大摩12年', '1657510140712.jpg', 5, 2450, '大摩12年主張結合來自兩種橡木桶的原酒:存放波本酒的美國橡木桶中的濃厚香草甜味，以及存放雪莉酒的西班牙橡木桶具有辛香味及乾果氣味。', NULL, 9, 0, 1, 1, '2022-07-11 11:29:00'),
(33, 'AWN11', '秩父純麥威士忌-綠葉', '1657510495501.jpg', 5, 5480, '這是一種由秩父和羽生生產的單一麥芽製成的混合麥芽。\r\n秩父羽生綠葉採用雪莉與波本雙桶製成。', NULL, 9, 0, 1, 1, '2022-07-11 11:34:55'),
(34, 'AWI01', '尊美醇愛爾蘭威士忌', '1657510905510.jpg', 5, 520, '採用最富饒區域的天然大麥及泉水，經過三次蒸餾過程、長年醇放於橡木桶中，這些堅持造就了口感滑順的尊美醇愛爾蘭威士忌。', NULL, 9, 0, 1, 1, '2022-07-11 11:41:45'),
(35, 'AWC01', '加拿大會所', '1657511154541.jpg', 5, 400, '加拿大俱樂部，在使用連續式蒸餾之下，擁有比较穩定的產品纯度，清淡溫和的口感，是其最被推崇的特色。', NULL, 9, 0, 1, 1, '2022-07-11 11:45:54'),
(36, 'AWS19N', '雅沐特 真橙', '1657511478249.jpg', 5, 4000, '於2015年隆重推出這款特殊風味創作之雅沐特「真橙」單一麥芽威士忌，它同時也是全球第一款橘子風味的威士忌。', NULL, 5, 0, 1, 1, '2022-07-11 11:51:18'),
(37, 'AL26', '野格利口酒', '1657511835163.jpg', 5, 588, '全球最熱賣的德國香甜酒，精選56種天然素材製作而成，以強烈甘草味為主要特色，裝瓶前經過陳放與過濾，推薦冰鎮或冷凍後飲用!', NULL, 9, 0, 1, 1, '2022-07-11 11:57:15'),
(38, 'AL21', 'DITA荔枝酒', '1657512014765.jpg', 5, 580, '他獨特的個性深受消費者的喜愛，一個1989年在法國產生的香甜酒品牌，擁有無比清爽的荔枝味道，透明顏色適合調配任何果汁或汽水。', NULL, 9, 0, 1, 1, '2022-07-11 12:00:14'),
(39, 'AL02C', '貝禮詩咖啡奶酒', '1657512340074.jpg', 5, 690, '運用愛爾蘭所蘊產出的純淨鮮乳，經過特殊方式提煉出的高純度鮮奶油調和，其濃郁的乳香融合著愛爾蘭威士忌的芳醇，再佐以香草、巧克力的濃郁口感，造就了這舉世聞名的Baileys貝禮詩香甜酒。', NULL, 5, 0, 1, 1, '2022-07-11 12:05:40'),
(40, 'AL61', '魅惑柚子酒', '1657513000797.jpg', 5, 1100, '瀨戶內海區域愛媛縣產柚子汁與愛知縣「大地之風」純米酒的相遇，柚子獨特的酸度在口中擴散，完美的酸甜平衡感，是一款百喝不膩的柚子酒。', NULL, 9, 0, 1, 1, '2022-07-11 12:16:40'),
(41, 'AL112', '戶河內 威士忌咖啡酒', '1657513241553.jpg', 5, 1200, '使用摩卡與巴西深焙咖啡豆，以炭焙去法增添咖啡香氣，並加入「戶河內威士忌」製作威士忌咖啡利口酒。\r\n帶有柑橘與辛香料香，如口同時感受炭焙咖啡呈現的甜味、酸味與苦味，末段有麥芽與煙燻尾韻。', NULL, 5, 0, 1, 1, '2022-07-11 12:20:41'),
(42, 'AL123', '電氣白蘭', '1657513460490.jpg', 5, 990, '日本淺草傳說之酒款。沿用電氣白蘭發售當時的標籤設計，發售將酒精濃度變更為40%的復刻版電氣白蘭(陳年)。大約自1893年起作為繼承的秘傳品牌。', NULL, 9, 0, 1, 1, '2022-07-11 12:24:20'),
(43, 'AL106', '京都千年抹茶酒', '1657513606039.jpg', 5, 1280, '使用京都頂級抹茶與原汁柚子，不加任何一滴釀造酒精，入口先是抹茶獨特甜味，緊接柚香而來，最後感受抹茶濃郁味，絕對是抹茶控的首選', NULL, 5, 0, 1, 1, '2022-07-11 12:26:46'),
(44, 'BE69', '奧利恩沖繩啤酒', '1657513927561.jpg', 5, 105, '採用了大方的三星圖案和ORION標識，以香檳金突出啤酒獨有的高質感和清涼感。整體設計包含了代表沖繩的「太陽紅」、「天空藍」和「海洋紺」，並採用了啤酒的「黃金色」。', NULL, 99, 0, 1, 1, '2022-07-11 12:32:07'),
(45, 'ASW26', '托卡尼5葡桶貴腐葡萄酒 ', '1657514121049.jpg', 5, 2380, '經典傳統派貴腐酒風貌，濃郁飽滿的蜂蜜、葡萄乾、無花果的風味，尾韻綿密長久。長達7年的橡木桶陳放，風味轉化得更加圓融細緻，酸甜平衡恰到好處。 ', NULL, 5, 0, 1, 1, '2022-07-11 12:35:21'),
(46, 'BE65', '琥珀之滴氣泡蜂蜜酒', '1657514472639.jpg', 5, 999, '身為臺灣第一支氣泡蜂蜜酒的先驅，老闆特別選用2020年秋季彰化產的百花蜜，無添加任何輔料釀造，呈現最純粹的蜂蜜香氣。', NULL, 5, 0, 1, 1, '2022-07-11 12:41:12'),
(47, 'AVE011', '馬丁尼香艾酒（EXTRA DRY）', '1657514851607.jpg', 5, 520, '酒款的核心是佛羅倫薩鳶尾的紫羅蘭酸味-鳶尾根在曬乾之前已經生長了三年。\r\n馬汀尼純香艾酒充滿新鮮的果香，同時帶有銳利的香氣與撩人的香甜，說是生來就為了調酒也不為過。', NULL, 5, 0, 1, 1, '2022-07-11 12:47:31'),
(48, 'AA07', '梵谷苦艾酒', '1657515318618.jpg', 5, 1680, '苦艾酒的起源地是瑞士， 在法國盛行。 所以很多法國跟瑞士的苦艾酒，飲用後口唇留香，其苦艾酒特有的淡淡清新在齒間徘徊，香氣盎然、回味悠然。', NULL, 9, 0, 1, 1, '2022-07-11 12:55:18'),
(49, 'ACH10', ' 夢香檳', '1657515570422.jpg', 5, 1600, 'Mumm (納帕瑪姆) 是 Napa Valley 最知名的氣泡酒莊之一。', NULL, 5, 0, 1, 1, '2022-07-11 12:59:30'),
(50, 'ABT01B', '安格式原味苦精', '1657515858483.jpg', 5, 720, '最被廣泛應用於雞尾酒的苦精，是以蘭姆酒、龍膽根和高山植物花朵 (Alpine Plant) 等植物材料的芳香味苦精。', NULL, 9, 0, 1, 1, '2022-07-11 13:04:18'),
(51, 'ASW03', '麗葉酒（白）', '1657516249646.jpg', 5, 1050, 'Wine+Liqueur 融合的風味餐前酒，柔順、細緻，充滿果香味。85% 白酒＋15% 柑橘類利口酒，再放入橡木桶。主要葡萄品種是 Semillon。', NULL, 9, 0, 1, 1, '2022-07-11 13:10:49'),
(52, 'SHK39', '寶酒造沖繩鳳梨泡盛 ', '1657516417103.jpg', 5, 780, '奢侈地以「沖繩產鳳梨汁」與石垣島高嶺酒造所的「於茂登炎」泡盛調和，果汁含量高達30%，配上清甜的蜂蜜，讓酸味更清爽，不管是純飲或調配雞尾酒都十分推薦！', NULL, 9, 0, 1, 1, '2022-07-11 13:13:37'),
(53, 'ASW01', '堤歐珮珮雪莉酒', '1657516639911.jpg', 5, 880, '葡萄酒達人林裕森《西班牙葡萄酒》讚譽有加：「Fino雪莉酒中的經典！」 明亮討喜的金黃色澤，帶著麵包及杏仁香，酒體優雅、飽滿而清新，餘韻悠長，微鹹帶果香的特色襯托海鮮更美味彈牙，冰鎮後飲用風味最佳！', NULL, 9, 0, 1, 1, '2022-07-11 13:17:19'),
(54, 'AB16S', '聖‧蕾米 XO 小樣', '1657516778177.jpg', 5, 150, '外觀呈現明亮琥珀散發深紅色澤，若靠近嗅聞，可感受到陳年韻味尾隨著微妙的木質與香草香，接著瀰漫熟成水果、果醬與蜂蜜的香味。', NULL, 9, 0, 1, 1, '2022-07-11 13:19:38'),
(55, 'SHK44', '天吹 純米大吟釀 雪人生酒', '1657516935883.jpg', 5, 1400, '一年一度的人氣秒殺酒款，紫茉莉花酵母特有的華麗高雅香氣與神秘酒米活潑獨特的滋味溫柔的包覆味蕾，搭配上應景的雪人標籤，不管是收藏或是享用都千萬不要錯過。 ', NULL, 9, 0, 1, 1, '2022-07-11 13:22:15'),
(56, 'CF-530', '經典不鏽鋼雪克杯．霧面髮絲紋（中）', '1657518639419.jpg', 5, 660, '不鏽鋼雪克杯用於以搖盪法調製的調酒，分別由不鏽鋼上蓋、中蓋與底杯所組成，由於有三個組件又被稱為三件式雪克杯，是最常見的雪克杯類型，也是調酒必備的工具。', NULL, 9, 0, 3, 1, '2022-07-11 13:50:39'),
(57, 'MG-01', '調酒杯（攪拌杯．透明）', '1657518866681.jpg', 5, 120, '調酒杯又稱為攪拌杯（Mixing Glass），用來製作以攪拌法調製的調酒，將材料和冰塊放入調酒杯中，攪拌均勻再濾掉冰塊將酒液倒入杯中。', NULL, 9, 0, 3, 1, '2022-07-11 13:54:26'),
(58, 'NJ-3325', '錐形量酒器', '1657519310126.jpg', 5, 120, '量酒器用於量取液體材料，本錐形量酒器（中）兩端分別為33 c.c.與25 c.c.', NULL, 9, 0, 3, 1, '2022-07-11 14:01:50'),
(59, 'BS-01', '吧叉匙（長）', '1657519494789.jpg', 5, 95, '吧叉匙用於以攪拌法製作的調酒，將材料放入調酒杯後加入冰塊，以吧叉匙攪拌均勻再用隔冰匙濾掉冰塊將酒液倒入杯中，通常與隔冰匙和調酒杯搭配使用。', NULL, 9, 0, 3, 1, '2022-07-11 14:04:54'),
(60, 'ST-01', '不鏽鋼隔冰匙', '1657519599812.jpg', 5, 150, '隔冰匙用於以攪拌法製作的調酒，可阻擋冰塊並倒出酒液，即使是使用雪克杯的搖盪法，也可改用隔冰匙濾冰，酒液流出速度會比使用雪克杯的隔冰蓋快很多。', NULL, 9, 0, 3, 1, '2022-07-11 14:06:39'),
(61, 'MU-02', '不鏽鋼搗棒', '1657519729196.jpg', 5, 270, '搗棒可壓榨新鮮水果或其他食材的汁液及氣味入酒，增添調酒的風味。', NULL, 9, 0, 3, 1, '2022-07-11 14:08:49'),
(62, 'ST-04', '角錐雙層濾網', '1657519814536.jpg', 5, 120, '本組濾網可過濾果渣、纖維與碎冰，雞尾酒調製完成後，可以用它將不想入酒的雜質濾掉。雙層濾網網面相當密、角錐造型也是針對雞尾酒調製設定，是您調酒不可或缺的工具!', NULL, 9, 0, 3, 1, '2022-07-11 14:10:14'),
(63, 'BP-03', '長方吧台墊', '1657519946529.jpg', 5, 380, '', NULL, 9, 0, 3, 1, '2022-07-11 14:12:26'),
(64, 'SP-01', '不鏽鋼濾水盤', '1657520055122.jpg', 5, 475, '濾水盤是家庭調酒必備的工具之一，因為一般家庭的流理台大多未設計可以大量擺放剛洗好杯具的空間，濾水盤可以倒放杯具和工具方便瀝乾，又不會吸附桌面的異味。', NULL, 9, 0, 3, 1, '2022-07-11 14:14:15'),
(65, 'CL-01', '白口布', '1657520117711.jpg', 5, 59, '口布在杯子洗過擦乾後可用來磨光表面、去除水漬和頑污', NULL, 9, 0, 3, 1, '2022-07-11 14:15:17'),
(66, 'PO-01', '金屬酒嘴（注酒器）', '1657520277490.jpg', 5, 140, '酒嘴可套在酒類或其他液體材料的瓶口，讓倒出液體時流量穩定不濺灑、不逆流，還可省下重複旋開、旋緊瓶塞的時間。', NULL, 9, 0, 3, 1, '2022-07-11 14:17:57'),
(67, 'IC-01', '不鏽鋼香檳桶', '1657521103452.jpg', 5, 499, '香檳桶用於冷卻紅白酒、氣泡酒、香檳與啤酒，並可於飲用的同時維持酒液低溫，確保您每一杯都能在最美味的狀態下飲用。', NULL, 9, 0, 3, 1, '2022-07-11 14:31:43'),
(68, 'IS-02', '不鏽鋼冰鏟', '1657521172198.jpg', 5, 239, '冰鏟是調酒時用於撈取冰塊的工具，比冰夾更有效率，乾淨又衛生。', NULL, 9, 0, 3, 1, '2022-07-11 14:32:52'),
(69, 'BT-01', '榨汁器（含濾網）', '1657521418546.jpg', 5, 100, '榨汁器可用來榨取調酒最常用到的幾種果汁，例如檸檬、柳橙、葡萄柚等，附濾網可過濾籽子與果渣。', NULL, 9, 0, 3, 1, '2022-07-11 14:36:58'),
(70, 'BT-04', '多功能PUNCH缸', '1657521560563.jpg', 5, 1960, 'PUNCH缸是雞尾酒會、歐式自助餐會與各式活動中提供飲料的容器\r\n在家庭調酒可預先調好PUNCH酒（例如Sangria），需要飲用時在從缸中撈取即可。', NULL, 5, 0, 3, 1, '2022-07-11 14:39:20'),
(71, 'GM01', '經典馬丁尼杯', '1657521687131.jpg', 5, 264, '雞尾酒之王，是馬丁尼（Martini），而裝盛馬丁尼的馬丁尼杯可說是象徵雞尾酒的圖騰，倒三角的獨特造型也成為雞尾酒杯的代名詞，它是調製雞尾酒最常用到的杯具之一，也是入門調酒不可不備的選擇。', NULL, 10, 0, 4, 1, '2022-07-11 14:41:27'),
(72, 'GW09', '弧面威士忌杯‧大', '1657521806639.jpg', 5, 122, '弧面威士忌杯底座厚質感沉穩、杯壁薄、透光度佳，加上優雅的弧狀曲線，是本局最推薦的中價位威士忌杯型。', NULL, 10, 0, 4, 1, '2022-07-11 14:43:26'),
(73, 'GH01', '經典可林杯', '1657521954846.jpg', 5, 70, '經典可林/高球杯無論是容量或造型都是最常用的杯型，中規中矩堅固耐用，很多調酒都用得到，建議兩個一起帶適合不同容量的調酒。', NULL, 99, 0, 4, 1, '2022-07-11 14:45:54'),
(74, 'GC01', ' V型香檳杯', '1657522063364.jpg', 5, 230, 'V型香檳杯是一、二代賣場最熱賣的香檳杯杯型，深V的設計無論是飲用香檳、氣泡酒，或是作為雞尾酒杯都相當好用', NULL, 10, 0, 4, 1, '2022-07-11 14:47:43'),
(75, 'GU01', '經典颶風杯', '1657522195848.jpg', 5, 135, '經典颶風杯是賣場銷售量最大的杯具，經常能在夜店、酒吧裡看到它的蹤跡，在電影中也常出現，可說是全世界熱賣的颶風杯杯型，它容量大、用途廣，適合調製長島冰茶、環遊世界與新加坡司令等長飲型調酒。', NULL, 99, 0, 4, 1, '2022-07-11 14:49:55'),
(76, 'GS02', '厚底烈酒杯', '1657522344210.jpg', 5, 80, '厚底烈酒杯是本局最推薦的Double SHOT杯型，追求高質感烈酒杯的您一定要帶一組。', NULL, 10, 0, 4, 1, '2022-07-11 14:52:24'),
(77, 'GB03', '曲線啤酒杯', '1657522512884.jpg', 5, 120, '曲線啤酒杯（中）容量剛好可以倒滿一杯裝啤酒（含泡沫），它也是一、二代賣場銷售量最大的啤酒杯，曲線設計好握又優雅，是您購入啤酒杯的首選！', NULL, 10, 0, 4, 1, '2022-07-11 14:55:12'),
(78, 'GB08', '握把啤酒杯', '1657522604715.jpg', 5, 120, '握把啤酒杯的容量剛好可以倒滿一杯330ml罐裝啤酒（含泡沫），它杯壁極厚，冷卻過後保冷效果佳，是二代賣場熱賣的握把啤酒杯', NULL, 10, 0, 4, 1, '2022-07-11 14:56:44'),
(79, 'GL03', '司令杯', '1657522697990.jpg', 5, 130, '厚底設計，很適合直接在底部搗碎新鮮水果或各式食材，或是調製司令（Sling）類的雞尾酒。', NULL, 9, 0, 4, 1, '2022-07-11 14:58:17'),
(80, 'GE05', '品酒杯 ', '1657522852427.jpg', 5, 110, '品酒杯縮口的設計能聚積酒體香氣，適合用來品飲各式酒類，亦可作為短飲型雞尾酒杯使用。', NULL, 10, 0, 4, 1, '2022-07-11 15:00:52'),
(81, 'GG02', ' 瑪格麗特杯', '1657522972005.jpg', 5, 200, '瑪格麗特杯又稱為飛碟杯，它的名稱來自於一杯非常有名的經典調酒：瑪格麗特(Margarita)，飛碟杯杯口大可擺放湯匙或吸管，適合製作霜凍調酒，作為甜點或冰淇淋杯也很好用。', NULL, 10, 0, 4, 1, '2022-07-11 15:02:52'),
(82, 'GP01', '公杯', '1657523080940.jpg', 5, 70, '是最常見的公杯，價格平實即使喝蝦打破也不會感到心疼，經常需要拼酒的醉漢們一定要有一個的呀', NULL, 99, 0, 4, 1, '2022-07-11 15:04:40'),
(83, 'PS05', '多功能木製杯盤組A', '1657523321660.jpg', 5, 480, '多功能木製杯盤組A(5入)', NULL, 10, 0, 4, 1, '2022-07-11 15:08:41'),
(84, 'PS07', ' 九宮格SHOT杯盤組', '1657523394079.jpg', 5, 840, '九宮格shot杯盤組', NULL, 10, 0, 4, 1, '2022-07-11 15:09:54'),
(85, 'ABT16', '法國玫瑰水', '1657523648966.jpg', 5, 400, '100ml原廠裝瓶，非分裝瓶', NULL, 9, 0, 2, 1, '2022-07-11 15:14:08'),
(86, 'FA-04', '博克無酒精啤酒330ml ', '1657524042325.jpg', 5, 60, '博克無酒精啤酒的生產過程是世界上獨一無二的，與科學界的夥伴共同合作研發，通過一個獨特的發酵流程生產，它可以從完全發酵的啤酒中除去酒精，使其保持酒精啤酒之香氣與特點。\r\n', NULL, 10, 0, 2, 1, '2022-07-11 15:20:42'),
(87, 'YN-30', '柑橘風味糖漿 ', '1657524362834.jpg', 5, 380, '橘皮糖漿帶有溫和的橘皮味，不含酒精成分，用途廣泛。只要用點巧思，即可隨意創作出色的熱門飲品，包括檸檬汽水、蘇打，甚至與可可結合製作成橙香摩卡。', NULL, 10, 0, 2, 1, '2022-07-11 15:26:02'),
(88, 'FE-01', '梵提曼粉紅葡萄柚通寧水', '1657524479860.jpg', 5, 90, '由寶石紅葡萄柚和奎寧製成，口感清爽乾爽。用於杜松子酒、伏特加和汽水的優質滋補水。', NULL, 10, 0, 2, 1, '2022-07-11 15:27:59'),
(89, 'DF-15', '檸檬果乾', '1657524701415.jpg', 5, 80, '調酒好用、容易保存、質感優雅的裝飾物\r\n就是各種果乾啦！\r\n其中像是檸檬、香吉士與葡萄柚果乾\r\n還能用防風打火槍加以炙燒 燒出燻黑效果與焦糖香，只要放個一兩片在成品中 就能讓調酒質感大大提昇', NULL, 10, 0, 2, 1, '2022-07-11 15:31:41'),
(90, 'GM13S', '營業用馬丁尼杯（盒裝6入）', '1657524880474.jpg', 5, 410, '整盒出，恕不分售。', NULL, 10, 0, 4, 1, '2022-07-11 15:34:40');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `prd_list`
--
ALTER TABLE `prd_list`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `prd_list`
--
ALTER TABLE `prd_list`
  MODIFY `id` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
