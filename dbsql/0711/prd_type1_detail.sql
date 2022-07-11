-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2022-07-11 09:41:36
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
-- 資料表結構 `prd_type1_detail`
--

DROP TABLE IF EXISTS `prd_type1_detail`;
CREATE TABLE `prd_type1_detail` (
  `id` int(3) UNSIGNED NOT NULL,
  `prd_id` int(3) NOT NULL,
  `abv` int(3) NOT NULL,
  `origin` int(3) NOT NULL,
  `brand` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int(4) DEFAULT NULL,
  `cate_m` int(3) NOT NULL,
  `cate_s` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `prd_type1_detail`
--

INSERT INTO `prd_type1_detail` (`id`, `prd_id`, `abv`, `origin`, `brand`, `capacity`, `cate_m`, `cate_s`) VALUES
(1, 1, 40, 3, '雪松菓', 700, 5, 45),
(2, 2, 40, 2, 'Grey Goose', 750, 5, 46),
(3, 3, 40, 10, '雪樹', 700, 5, 47),
(4, 4, 50, 4, '思美洛夫', 1000, 5, 48),
(5, 5, 40, 11, 'Crystal Head', 750, 5, 49),
(6, 6, 28, 4, '希普史密斯', 500, 5, 50),
(7, 7, 40, 3, '鱘龍魚', 700, 5, 51),
(8, 8, 47, 4, '坦奎瑞', 700, 9, 66),
(9, 9, 44, 5, '雷森', 750, 9, 67),
(10, 10, 41, 12, '茉菲', 700, 9, 68),
(11, 11, 42, 11, '阿夸維特', 750, 9, 69),
(12, 12, 45, 6, '和美人', 495, 9, 70),
(13, 13, 40, 15, '百家得', 750, 6, 52),
(14, 14, 40, 16, '麥斯', 700, 6, 53),
(15, 15, 76, 17, 'Don Q ', 700, 6, 54),
(16, 16, 40, 5, 'Whistling Andy', 750, 6, 55),
(17, 17, 40, 14, '薩凱帕', 1000, 6, 56),
(18, 18, 41, 13, '亞瓜拉', 750, 6, 57),
(19, 19, 40, 9, '培恩', 375, 10, 71),
(20, 20, 40, 9, 'EL Jimador', 750, 10, 72),
(21, 21, 40, 9, '唐胡立歐', 750, 10, 73),
(22, 22, 38, 9, 'Don Julio', 750, 10, 74),
(23, 23, 38, 9, 'Don Julio', 700, 10, 75),
(24, 24, 40, 9, 'Mezcal', 750, 10, 76),
(25, 25, 45, 2, '皮耶費朗', 700, 7, 58),
(26, 26, 40, 5, '萊爾德', 750, 7, 59),
(27, 27, 43, 18, 'Porton', 750, 10, 76),
(28, 28, 42, 5, '酩帝', 700, 11, 77),
(29, 29, 46, 5, 'Pepper', 750, 11, 78),
(30, 30, 43, 5, '酩帝', 700, 11, 79),
(31, 31, 40, 19, 'JOHNNIE WALKER', 1000, 11, 80),
(32, 32, 40, 19, '大摩', 1000, 11, 81),
(33, 33, 46, 6, '秩父', 700, 11, 82),
(34, 34, 40, 20, '尊美醇', 700, 11, 83),
(35, 35, 40, 11, 'Canadian Club', 700, 11, 84),
(36, 36, 50, 21, 'Amrut', 700, 11, 85),
(37, 37, 35, 22, '野格', 700, 8, 61),
(38, 38, 21, 2, 'DITA', 700, 8, 62),
(39, 39, 17, 20, 'Baileys', 700, 8, 63),
(40, 40, 7, 6, '丸石 ', 500, 8, 64),
(41, 41, 18, 6, '櫻尾釀造蒸餾', 500, 8, 65),
(42, 42, 40, 6, '合同酒精株式會社', 720, 12, 86),
(43, 43, 6, 6, '天吹', 720, 8, 62),
(44, 44, 5, 6, '奧利恩', 500, 12, 88),
(45, 45, 13, 23, '托卡尼酒莊', 500, 12, 89),
(46, 46, 9, 1, 'AmberDrop', 720, 12, 90),
(47, 47, 15, 12, 'Martini', 750, 12, 91),
(48, 48, 55, 2, 'absente', 700, 12, 92),
(49, 49, 12, 2, 'Mums', 750, 12, 93),
(50, 50, 45, 24, 'Angostura', 200, 12, 94),
(51, 51, 17, 2, 'Lillet', 750, 12, 95),
(52, 52, 12, 6, '寶酒造', 720, 12, 96),
(53, 53, 15, 25, '堤歐', 750, 12, 97),
(54, 54, 40, 2, '聖-雷米', 50, 12, 98),
(55, 55, 16, 6, '天吹', 720, 12, 99);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `prd_type1_detail`
--
ALTER TABLE `prd_type1_detail`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `prd_type1_detail`
--
ALTER TABLE `prd_type1_detail`
  MODIFY `id` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
