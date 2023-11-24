-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2023 at 02:31 PM
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
  `current_budget` float(10,2) NOT NULL,
  `budget_start_date` date DEFAULT NULL,
  `budget_end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `budget`
--

INSERT INTO `budget` (`budget_id`, `user_id`, `budget_name`, `budget_amount`, `current_budget`, `budget_start_date`, `budget_end_date`) VALUES
(1, 2, 'Weekly', 3000.00, 3000.00, '2023-11-22', '2023-12-22'),
(2, 2, 'Hatdog', 633333.00, 633333.00, '2023-11-22', '2023-11-29'),
(3, 2, 'PangMotr', 60000.00, 60000.00, '2023-11-22', '2023-11-29'),
(4, 1, 'Palit Laptop', 56984.00, 56984.00, '2023-11-22', '0000-00-00'),
(5, 1, 'asda', 23123.00, 23123.00, '2023-11-22', '0000-00-00'),
(6, 1, 'adasdasd', 12313123.00, 12313123.00, '2023-11-22', '2023-11-30'),
(7, 1, 'ha?', 38.00, 38.00, '2023-11-22', '2024-06-30'),
(8, 1, '123', 213123.00, 213123.00, '2023-11-22', '2000-02-23'),
(9, 1, '123', 123.00, 123.00, '2023-11-22', '2023-12-12'),
(10, 1, 'tarong na', 60325.00, 60325.00, '2023-11-22', '2023-11-27'),
(11, 2, 'Weekend', 111111.00, 111111.00, '2023-11-23', '2023-12-23');

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
(27, 1, 'ssssss', 11111.00, 'Others', '2023-11-23 17:12:01'),
(28, 1, 'Pls', 100.00, 'Others', '2023-11-23 17:12:01'),
(30, 3, 'Change Oil', 350.00, 'Utilities', '2023-11-23 17:12:01'),
(31, 1, 'Bawn', 200.00, 'Others', '2023-11-23 17:12:01'),
(32, 4, 'Tagay', 600.00, 'Others', '2023-11-23 17:12:01'),
(33, 1, 'tagaynasad', 6000.00, 'Others', '2023-11-23 17:12:01'),
(34, 1, 'test', 123123.00, 'Others', '2023-11-23 17:12:20'),
(35, 4, 'tagay', 1000.00, 'Others', '2023-11-23 17:19:16'),
(36, 4, 'tagay ', 111.00, 'Others', '2023-11-23 17:21:32');

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE `reminders` (
  `reminder_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `reminder_name` varchar(50) NOT NULL,
  `reminder_description` varchar(255) NOT NULL,
  `reminder_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `savings`
--

CREATE TABLE `savings` (
  `savings_id` int(11) NOT NULL,
  `budget_id` int(11) DEFAULT NULL,
  `savings_name` varchar(50) NOT NULL,
  `savings_amount` float(10,2) NOT NULL,
  `savings_date` date DEFAULT NULL
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
(3, 'new', 'new', 'new@new.new', 'New12345');

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
  ADD PRIMARY KEY (`savings_id`),
  ADD KEY `budget_id` (`budget_id`);

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
  MODIFY `budget_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expense_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `reminders`
--
ALTER TABLE `reminders`
  MODIFY `reminder_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `savings`
--
ALTER TABLE `savings`
  MODIFY `savings_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Constraints for table `savings`
--
ALTER TABLE `savings`
  ADD CONSTRAINT `savings_ibfk_1` FOREIGN KEY (`budget_id`) REFERENCES `budget` (`budget_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
