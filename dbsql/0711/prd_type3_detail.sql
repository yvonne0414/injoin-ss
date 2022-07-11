-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2022-07-11 09:41:54
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
-- 資料表結構 `prd_type3_detail`
--

DROP TABLE IF EXISTS `prd_type3_detail`;
CREATE TABLE `prd_type3_detail` (
  `id` int(3) UNSIGNED NOT NULL,
  `prd_id` int(3) NOT NULL,
  `origin` int(3) NOT NULL,
  `capacity` int(4) DEFAULT NULL,
  `mater` int(3) NOT NULL,
  `cate_m` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `prd_type3_detail`
--

INSERT INTO `prd_type3_detail` (`id`, `prd_id`, `origin`, `capacity`, `mater`, `cate_m`) VALUES
(1, 56, 1, 530, 1, 20),
(2, 57, 1, 500, 2, 21),
(3, 58, 1, 33, 1, 22),
(4, 59, 1, 0, 1, 23),
(5, 60, 1, 0, 1, 24),
(6, 61, 1, 0, 1, 23),
(7, 62, 1, 0, 1, 24),
(8, 64, 1, 0, 1, 25),
(9, 66, 1, 0, 1, 26),
(10, 65, 1, 0, 3, 25),
(11, 67, 1, 0, 1, 28),
(12, 68, 1, 0, 1, 28),
(13, 69, 1, 0, 5, 29),
(14, 70, 1, 7600, 5, 29),
(15, 71, 12, 245, 2, 31),
(16, 72, 5, 355, 2, 32),
(17, 73, 26, 370, 2, 33),
(18, 74, 12, 160, 2, 34),
(19, 75, 5, 444, 2, 35),
(20, 76, 12, 70, 2, 36),
(21, 77, 26, 475, 2, 37),
(22, 78, 5, 355, 2, 37),
(23, 79, 12, 320, 2, 38),
(24, 80, 12, 200, 2, 39),
(25, 81, 26, 345, 2, 40),
(26, 82, 26, 255, 2, 41),
(27, 83, 1, 0, 2, 42),
(28, 84, 1, 0, 2, 42),
(29, 90, 26, 140, 2, 43);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `prd_type3_detail`
--
ALTER TABLE `prd_type3_detail`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `prd_type3_detail`
--
ALTER TABLE `prd_type3_detail`
  MODIFY `id` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
