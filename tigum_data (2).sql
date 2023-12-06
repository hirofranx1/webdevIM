-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 06, 2023 at 05:11 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tigum_data`
--

-- --------------------------------------------------------

--
-- Table structure for table `budget`
--

CREATE TABLE `budget` (
  `budget_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `budget_name` varchar(50) NOT NULL,
  `budget_amount` float(10,2) NOT NULL,
  `budget_start_date` date DEFAULT NULL,
  `budget_end_date` date DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `budget`
--

INSERT INTO `budget` (`budget_id`, `user_id`, `budget_name`, `budget_amount`, `budget_start_date`, `budget_end_date`, `is_deleted`) VALUES
(1, 2, 'Weekly', 10000.00, '2023-11-22', '2023-12-14', 0),
(2, 2, 'Hatdog', 633333.00, '2023-11-22', '2023-11-29', 1),
(3, 2, 'PangMotr', 60000.00, '2023-11-22', '2023-11-29', 1),
(4, 1, 'Palit Laptop', 56984.00, '2023-11-22', '0000-00-00', 0),
(5, 1, 'asda', 23123.00, '2023-11-22', '0000-00-00', 0),
(6, 1, 'adasdasd', 12313123.00, '2023-11-22', '2023-11-30', 0),
(7, 1, 'ha?', 38.00, '2023-11-22', '2024-06-30', 0),
(8, 1, '123', 213123.00, '2023-11-22', '2000-02-23', 0),
(9, 1, '123', 123.00, '2023-11-22', '2023-12-12', 0),
(10, 1, 'tarong na', 60325.00, '2023-11-22', '2023-11-27', 0),
(11, 2, 'Weekend', 111111.00, '2023-11-23', '2023-12-28', 0),
(12, 2, 'Secrettttt', 2000.00, '2023-12-04', '2024-01-01', 0),
(14, 2, 'asd', 123.00, '2023-12-05', '2023-12-12', 0),
(15, 2, 'BudgetSample', 50.00, '2023-12-05', '2023-12-12', 0),
(18, 2, 'sample', 1000.00, '2023-12-06', '2023-12-13', 0),
(19, 4, 'sample', 231.00, '2023-12-06', '2023-12-13', 1),
(20, 4, 'Sample', 100.00, '2023-12-06', '2023-12-13', 0),
(21, 4, 'Samplke', 1000.00, '2023-12-06', '2023-12-13', 0);

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expense_id` int(11) NOT NULL,
  `budget_id` int(11) DEFAULT NULL,
  `expense_name` varchar(50) NOT NULL,
  `expense_amount` float(10,2) NOT NULL,
  `expense_category` varchar(50) DEFAULT NULL,
  `expense_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`expense_id`, `budget_id`, `expense_name`, `expense_amount`, `expense_category`, `expense_time`) VALUES
(55, 2, 'sud an', 100.00, 'Food', '2023-12-02 21:18:04'),
(58, 1, 'basta', 200.00, 'Others', '2023-12-02 21:30:32'),
(59, 1, 'basta', 200.00, 'Others', '2023-12-02 21:30:34'),
(60, 1, 'secret', 200.00, 'Others', '2023-12-02 21:31:22'),
(61, 2, 'talong', 100.00, 'Others', '2023-12-02 21:33:45'),
(62, 2, 'sad', 123.00, 'Others', '2023-12-02 21:34:29'),
(63, 11, 'gasMoney', 1000.00, 'Others', '2023-12-02 21:41:55'),
(64, 3, 'gas', 1000.00, 'Others', '2023-12-02 21:43:13'),
(65, 3, 'Gassss', 1000.00, 'Others', '2023-12-02 21:51:52'),
(66, 11, '123', 123.00, 'Food', '2023-12-02 21:53:01'),
(67, 11, 'asd', 123.00, 'Others', '2023-12-02 21:54:10'),
(68, 2, 'kan on ', 600.00, 'Others', '2023-09-08 16:00:00'),
(72, 3, 'tagay', 1000.00, 'Utilities', '2023-12-04 09:42:29'),
(73, 1, 'tagay ', 1000.00, 'Others', '2023-12-04 09:48:52'),
(74, 2, 'isda', 500.00, 'Food', '2023-12-04 09:49:21'),
(75, 1, 'tower', 800.00, 'Food', '2023-12-04 10:25:50'),
(76, 3, 'expense', 111.00, 'Transportation', '2023-12-04 12:49:29'),
(77, 1, 'hmmm', 123.00, 'Transportation', '2023-12-04 12:49:59'),
(78, 1, 'adasdasdasd', 231.00, 'Others', '2023-12-04 12:50:31'),
(79, 3, 'vct cleaning', 500.00, 'Others', '2023-12-04 12:53:44'),
(113, 14, 'asd', 100.00, 'Entertainment', '2023-12-05 15:02:05'),
(116, 14, 'ASDsample', 23.00, 'Entertainment', '2023-12-05 17:30:25'),
(117, 12, 'Sample', 1000.00, 'Entertainment', '2023-12-05 19:48:27'),
(118, 12, 'Gastonsasd', 500.00, 'Utilities', '2023-12-05 19:49:44'),
(119, 2, 'Hello', 123.00, 'Others', '2023-12-05 23:05:47'),
(121, 19, 'sample ', 100.00, 'Food', '2023-01-06 10:53:58'),
(122, NULL, 'asd', 100.00, 'Others', '2023-12-06 10:55:01'),
(123, 20, '100', 100.00, 'Entertainment', '2023-12-06 11:22:43');

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE `reminders` (
  `reminder_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `budget_id` int(11) NOT NULL,
  `reminder_name` varchar(50) NOT NULL,
  `reminder_description` varchar(255) NOT NULL,
  `reminder_date` date DEFAULT NULL,
  `budget_name` varchar(11) DEFAULT NULL,
  `reminder_amount` int(11) DEFAULT NULL,
  `reminder_category` varchar(255) NOT NULL,
  `isPaid` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reminders`
--

INSERT INTO `reminders` (`reminder_id`, `user_id`, `budget_id`, `reminder_name`, `reminder_description`, `reminder_date`, `budget_name`, `reminder_amount`, `reminder_category`, `isPaid`) VALUES
(40, 2, 14, 'ASDsample', '', '2023-12-07', 'asd', 23, 'Entertainment', 1),
(41, 2, 12, 'Sample', '', '2023-12-22', 'Secrettttt', 1000, 'Entertainment', 1),
(43, 2, 2, 'Hello', '', '2023-12-22', 'Hatdog', 123, 'Others', 1);

-- --------------------------------------------------------

--
-- Table structure for table `savings`
--

CREATE TABLE `savings` (
  `savings_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `budget_id` int(11) DEFAULT NULL,
  `savings_name` varchar(50) NOT NULL,
  `savings_amount` float(10,2) NOT NULL,
  `savings_date` date DEFAULT current_timestamp(),
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `savings`
--

INSERT INTO `savings` (`savings_id`, `user_id`, `budget_id`, `savings_name`, `savings_amount`, `savings_date`, `is_deleted`) VALUES
(1, 2, NULL, 'Budget Savings', 108446.00, '2023-12-06', 0),
(2, 4, NULL, 'Budget Savings', 0.00, '2023-12-06', 0),
(3, 2, NULL, 'sample', 123.00, NULL, 0),
(4, 2, NULL, 'Save For Xmas', 100.00, '2023-12-06', 0);

-- --------------------------------------------------------

--
-- Table structure for table `savings_add`
--

CREATE TABLE `savings_add` (
  `savings_add_id` int(11) NOT NULL,
  `savings_id` int(11) DEFAULT NULL,
  `savings_add_amount` int(11) DEFAULT NULL,
  `savings_add_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `firstname`, `lastname`, `email`, `password`) VALUES
(1, 'hat', 'dog', 'hat@dog.hatdog', 'Hat12345'),
(2, 'hat', 'dog', 'hat@hat.hat', 'Hat12345'),
(3, 'new', 'new', 'new@new.new', 'New12345'),
(4, 'Hello', 'World', 'sample@sample.sample', 'Sample12345');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `afterUserInsert` AFTER INSERT ON `users` FOR EACH ROW INSERT INTO savings (user_id, savings_name, savings_amount, savings_date)
    VALUES (NEW.user_id, 'Budget Savings', 0, CURRENT_TIMESTAMP)
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `budget`
--
ALTER TABLE `budget`
  ADD PRIMARY KEY (`budget_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expense_id`),
  ADD KEY `budget_id` (`budget_id`);

--
-- Indexes for table `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`reminder_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `savings`
--
ALTER TABLE `savings`
  ADD PRIMARY KEY (`savings_id`);

--
-- Indexes for table `savings_add`
--
ALTER TABLE `savings_add`
  ADD PRIMARY KEY (`savings_add_id`),
  ADD KEY `savings_id` (`savings_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `budget`
--
ALTER TABLE `budget`
  MODIFY `budget_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expense_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=125;

--
-- AUTO_INCREMENT for table `reminders`
--
ALTER TABLE `reminders`
  MODIFY `reminder_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `savings`
--
ALTER TABLE `savings`
  MODIFY `savings_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `savings_add`
--
ALTER TABLE `savings_add`
  MODIFY `savings_add_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `budget`
--
ALTER TABLE `budget`
  ADD CONSTRAINT `budget_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`budget_id`);

--
-- Constraints for table `reminders`
--
ALTER TABLE `reminders`
  ADD CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `savings_add`
--
ALTER TABLE `savings_add`
  ADD CONSTRAINT `savings_add_ibfk_1` FOREIGN KEY (`savings_id`) REFERENCES `savings` (`savings_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
