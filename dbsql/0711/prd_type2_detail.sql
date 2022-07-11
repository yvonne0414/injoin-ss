-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2022-07-11 09:41:44
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
-- 資料表結構 `prd_type2_detail`
--

DROP TABLE IF EXISTS `prd_type2_detail`;
CREATE TABLE `prd_type2_detail` (
  `id` int(3) UNSIGNED NOT NULL,
  `prd_id` int(3) NOT NULL,
  `origin` int(3) NOT NULL,
  `brand` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int(4) DEFAULT NULL,
  `cate_m` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `prd_type2_detail`
--

INSERT INTO `prd_type2_detail` (`id`, `prd_id`, `origin`, `brand`, `capacity`, `cate_m`) VALUES
(1, 85, 2, 'Terre Exotique', 100, 13),
(2, 87, 2, ' Monin ', 700, 16),
(3, 88, 4, 'Fentimans', 200, 17),
(4, 89, 1, 'MS', 0, 18);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `prd_type2_detail`
--
ALTER TABLE `prd_type2_detail`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `prd_type2_detail`
--
ALTER TABLE `prd_type2_detail`
  MODIFY `id` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
