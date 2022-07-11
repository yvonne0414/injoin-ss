-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2022-07-11 10:25:30
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
-- 資料表結構 `prd_origin`
--

DROP TABLE IF EXISTS `prd_origin`;
CREATE TABLE `prd_origin` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `prd_origin`
--

INSERT INTO `prd_origin` (`id`, `name`) VALUES
(1, '台灣'),
(2, '法國'),
(3, '俄羅斯'),
(4, '英國'),
(5, '美國'),
(6, '日本'),
(7, '荷蘭'),
(8, '澳洲'),
(9, '墨西哥'),
(10, '波蘭'),
(11, '加拿大'),
(12, '義大利'),
(13, '巴西'),
(14, '瓜地馬拉'),
(15, '古巴'),
(16, '牙買加'),
(17, '加勒比海'),
(18, '祕魯'),
(19, '蘇格蘭'),
(20, '愛爾蘭'),
(21, '印度'),
(22, '德國'),
(23, '斯洛伐克'),
(24, '千里達與托巴哥'),
(25, '西班牙'),
(26, '泰國'),
(27, '葡萄牙');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `prd_origin`
--
ALTER TABLE `prd_origin`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `prd_origin`
--
ALTER TABLE `prd_origin`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
