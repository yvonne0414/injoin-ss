-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2022-07-11 09:41:10
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
-- 資料表結構 `prd_img`
--

DROP TABLE IF EXISTS `prd_img`;
CREATE TABLE `prd_img` (
  `id` int(3) UNSIGNED NOT NULL,
  `prd_id` int(3) NOT NULL,
  `url` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `prd_img`
--

INSERT INTO `prd_img` (`id`, `prd_id`, `url`) VALUES
(1, 2, '1657183798986.jpg'),
(2, 2, '1657183798989.jpg'),
(3, 3, '1657187491197.jpg'),
(4, 3, '1657187491197.jpg'),
(5, 8, '1657335109840.jpg'),
(6, 8, '1657335109843.jpg'),
(7, 18, '1657339337882.jpg'),
(8, 23, '1657341152394.jpg'),
(9, 29, '1657509462808.jpg'),
(10, 29, '1657509462810.jpg'),
(11, 31, '1657510019667.jpg'),
(12, 31, '1657510019668.jpg'),
(13, 33, '1657510495504.jpg'),
(14, 37, '1657511835164.jpg'),
(15, 37, '1657511835165.jpg'),
(16, 42, '1657513460492.jpg'),
(17, 42, '1657513460496.jpg'),
(18, 45, '1657514121049.jpg'),
(19, 51, '1657516249649.jpg'),
(20, 51, '1657516249654.jpg'),
(21, 53, '1657516639913.jpg'),
(22, 56, '1657518639419.jpg'),
(23, 56, '1657518639420.jpg'),
(24, 57, '1657518866682.jpg'),
(25, 57, '1657518866682.jpg'),
(26, 58, '1657519310126.jpg'),
(27, 58, '1657519310126.jpg'),
(28, 59, '1657519494789.jpg'),
(29, 59, '1657519494789.jpg'),
(30, 60, '1657519599812.jpg'),
(31, 61, '1657519729196.jpg'),
(32, 62, '1657519814536.jpg'),
(33, 62, '1657519814537.jpg'),
(34, 63, '1657519946529.jpg'),
(35, 63, '1657519946529.jpg'),
(36, 64, '1657520055123.jpg'),
(37, 66, '1657520277491.jpg'),
(38, 68, '1657521172198.jpg'),
(39, 69, '1657521418546.jpg'),
(40, 70, '1657521560563.jpg'),
(41, 70, '1657521560564.jpg'),
(42, 71, '1657521687131.jpg'),
(43, 71, '1657521687132.jpg'),
(44, 72, '1657521806640.jpg'),
(45, 72, '1657521806641.jpg'),
(46, 73, '1657521954847.jpg'),
(47, 73, '1657521954848.jpg'),
(48, 74, '1657522063364.jpg'),
(49, 74, '1657522063364.jpg'),
(50, 75, '1657522195848.jpg'),
(51, 75, '1657522195848.jpg'),
(52, 76, '1657522344210.jpg'),
(53, 77, '1657522512885.jpg'),
(54, 77, '1657522512886.jpg'),
(55, 78, '1657522604715.jpg'),
(56, 78, '1657522604717.jpg'),
(57, 79, '1657522697995.jpg'),
(58, 80, '1657522852428.jpg'),
(59, 80, '1657522852429.jpg'),
(60, 81, '1657522972006.jpg'),
(61, 81, '1657522972007.jpg'),
(62, 82, '1657523080941.jpg'),
(63, 83, '1657523321660.jpg'),
(64, 84, '1657523394081.jpg'),
(65, 84, '1657523394106.jpg'),
(66, 85, '1657523648968.jpg'),
(67, 88, '1657524479861.jpg'),
(68, 88, '1657524479862.jpg'),
(69, 89, '1657524701419.jpg'),
(70, 89, '1657524701424.jpg'),
(71, 90, '1657524880474.jpg');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `prd_img`
--
ALTER TABLE `prd_img`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `prd_img`
--
ALTER TABLE `prd_img`
  MODIFY `id` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
