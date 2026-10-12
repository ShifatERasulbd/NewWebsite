-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2026 at 08:10 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crm_saas`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `log_name` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `subject_type` varchar(255) DEFAULT NULL,
  `event` varchar(255) DEFAULT NULL,
  `subject_id` bigint(20) UNSIGNED DEFAULT NULL,
  `causer_type` varchar(255) DEFAULT NULL,
  `causer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`properties`)),
  `batch_uuid` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_log`
--

INSERT INTO `activity_log` (`id`, `log_name`, `description`, `subject_type`, `event`, `subject_id`, `causer_type`, `causer_id`, `properties`, `batch_uuid`, `created_at`, `updated_at`) VALUES
(1, 'user', 'created', 'App\\Models\\User', 'created', 3, NULL, NULL, '{\"attributes\":{\"name\":\"Activity Log Test\",\"company_name\":\"Test Co\",\"phone_number\":\"123456\",\"email\":\"activitylog_test_1780554199@example.com\",\"password\":\"$2y$12$m2NsZvsHb0.BWqysBa3zUu8xsrK9OHmqQgLrkQ6BW6orlPaz3xLqC\"}}', NULL, '2026-06-04 00:23:19', '2026-06-04 00:23:19'),
(2, 'user', 'created', 'App\\Models\\User', 'created', 4, NULL, NULL, '{\"attributes\":{\"name\":\"Shifat E Rasul\",\"company_name\":\"Soft Spark Solution\",\"phone_number\":\"+8801871769835\",\"email\":\"shifaterasulbd@gmail.com\",\"password\":\"$2y$12$\\/0xnvvXVQwYZMXoTKtkVh.Z.\\/s3VrDiTFbwuO6BHYPJhkY4WFT5wm\"}}', NULL, '2026-06-04 00:26:33', '2026-06-04 00:26:33'),
(3, 'user', 'deleted', 'App\\Models\\User', 'deleted', 2, 'App\\Models\\User', 4, '{\"old\":{\"name\":\"Shifat E Rasul\",\"company_name\":\"Soft Spark Solution\",\"phone_number\":\"+8801680752193\",\"email\":\"admin@softsparksolution.com\",\"password\":\"$2y$12$rtY21IixjfWgGfISUNMNVOYh62BA\\/VBDcrMUFcHh7JKI2tvMslk0a\"}}', NULL, '2026-06-04 00:26:56', '2026-06-04 00:26:56'),
(4, 'user', 'deleted', 'App\\Models\\User', 'deleted', 3, 'App\\Models\\User', 4, '{\"old\":{\"name\":\"Activity Log Test\",\"company_name\":\"Test Co\",\"phone_number\":\"123456\",\"email\":\"activitylog_test_1780554199@example.com\",\"password\":\"$2y$12$m2NsZvsHb0.BWqysBa3zUu8xsrK9OHmqQgLrkQ6BW6orlPaz3xLqC\"}}', NULL, '2026-06-04 00:26:59', '2026-06-04 00:26:59'),
(5, 'user', 'updated', 'App\\Models\\User', 'updated', 4, NULL, NULL, '{\"attributes\":{\"google_id\":\"111752461072414542168\"},\"old\":{\"google_id\":null}}', NULL, '2026-06-04 01:36:56', '2026-06-04 01:36:56'),
(6, 'user', 'updated', 'App\\Models\\User', 'updated', 4, 'App\\Models\\User', 4, '{\"attributes\":{\"name\":\"Shifat E Rasul ullash\"},\"old\":{\"name\":\"Shifat E Rasul\"}}', NULL, '2026-06-04 01:51:30', '2026-06-04 01:51:30'),
(7, 'user', 'updated', 'App\\Models\\User', 'updated', 4, 'App\\Models\\User', 4, '{\"attributes\":{\"name\":\"Shifat E Rasul\"},\"old\":{\"name\":\"Shifat E Rasul ullash\"}}', NULL, '2026-06-04 01:51:41', '2026-06-04 01:51:41'),
(8, 'user', 'created', 'App\\Models\\User', 'created', 5, NULL, NULL, '{\"attributes\":{\"name\":\"Ghure Berai\",\"company_name\":\"Google Signup\",\"phone_number\":\"N\\/A\",\"email\":\"shifatbdtravels@gmail.com\",\"google_id\":\"116378580619298217670\",\"password\":\"$2y$12$UI5iJJNBCCxGkFVlPVdPNO8gVIQTmIhCMCvJpnOFKK923yfTZFrXS\"}}', NULL, '2026-06-04 02:00:55', '2026-06-04 02:00:55'),
(9, 'user', 'updated', 'App\\Models\\User', 'updated', 5, 'App\\Models\\User', 5, '{\"attributes\":{\"company_name\":\"Ghure Berai\",\"phone_number\":\"01871769835\"},\"old\":{\"company_name\":\"Google Signup\",\"phone_number\":\"N\\/A\"}}', NULL, '2026-06-04 02:17:44', '2026-06-04 02:17:44'),
(10, 'user', 'updated', 'App\\Models\\User', 'updated', 4, 'App\\Models\\User', 4, '{\"attributes\":{\"avatar\":\"\\/uploads\\/users\\/6296883c-35e8-4744-815e-30a426f94872.png\"},\"old\":{\"avatar\":null}}', NULL, '2026-06-04 02:40:27', '2026-06-04 02:40:27'),
(11, 'user', 'updated', 'App\\Models\\User', 'updated', 4, NULL, NULL, '{\"attributes\":{\"password\":\"$2y$12$a5BCsNRT2K\\/vwipc90K2lOgVc0x0whxxZPdzQ7l5lteEzhVvTQFA2\"},\"old\":{\"password\":\"$2y$12$\\/0xnvvXVQwYZMXoTKtkVh.Z.\\/s3VrDiTFbwuO6BHYPJhkY4WFT5wm\"}}', NULL, '2026-06-05 01:59:33', '2026-06-05 01:59:33');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('crm-cache-5c785c036466adea360111aa28563bfd556b5fba', 'i:5;', 1780646389),
('crm-cache-5c785c036466adea360111aa28563bfd556b5fba:timer', 'i:1780646389;', 1780646389);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_24_082423_create_personal_access_tokens_table', 1),
(5, '2026_06_02_120000_add_deleted_at_to_users_table', 2),
(8, '2026_06_04_100000_add_company_and_phone_to_users_table', 3),
(9, '2026_06_04_062031_create_activity_log_table', 4),
(10, '2026_06_04_062032_add_event_column_to_activity_log_table', 4),
(11, '2026_06_04_062033_add_batch_uuid_column_to_activity_log_table', 4),
(12, '2026_06_04_065234_add_google_id_to_users_table', 5),
(13, '2026_06_04_121500_add_avatar_to_users_table', 6);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('shifatbdtravels@gmail.com', '$2y$12$o.z1I8x7uJ9s6LNN7WXvaeSsTgupQp6p49f97P9.Oo.OU8MC5f1TK', '2026-06-05 01:59:12');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('MTbE3fMQgs2HTr7R6UVctfcfZtDeg3km4rTzFjg9', 4, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJjTUVNWlFGVk5vbVZXTmFERW9lbXpjbU44aWh5N1Uzb1JKUnRxdXAxIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvbG9jYWxob3N0OjgwMDAiLCJyb3V0ZSI6ImxvZ2luIn0sInVybCI6eyJpbnRlbmRlZCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC8ud2VsbC1rbm93blwvYXBwc3BlY2lmaWNcL2NvbS5jaHJvbWUuZGV2dG9vbHMuanNvbiJ9LCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6NH0=', 1780646915),
('O0rfOpcTauNoezOoAvK3w8m5GDPeD8aedAKOJUPw', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJPeFlORWZPdkNoV3JVVHZFWEN2WXlvdVczb2tma3pjem1IOVBqdjd1IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwIiwicm91dGUiOiJsb2dpbiJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1780637342);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `google_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `company_name`, `phone_number`, `avatar`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `deleted_at`, `google_id`) VALUES
(1, 'Supper Admin', '', '', NULL, 'superadmin@gmail.com', NULL, '$2y$12$xjHIF7h1UKm3raSpGlpAa.TZToYTOgX9TibRtcTBZ8vFlpDkyQFou', NULL, NULL, NULL, NULL, NULL),
(2, 'Shifat E Rasul', 'Soft Spark Solution', '+8801680752193', NULL, 'admin@softsparksolution.com', NULL, '$2y$12$rtY21IixjfWgGfISUNMNVOYh62BA/VBDcrMUFcHh7JKI2tvMslk0a', NULL, '2026-06-04 00:18:51', '2026-06-04 00:26:56', '2026-06-04 00:26:56', NULL),
(3, 'Activity Log Test', 'Test Co', '123456', NULL, 'activitylog_test_1780554199@example.com', NULL, '$2y$12$m2NsZvsHb0.BWqysBa3zUu8xsrK9OHmqQgLrkQ6BW6orlPaz3xLqC', NULL, '2026-06-04 00:23:19', '2026-06-04 00:26:59', '2026-06-04 00:26:59', NULL),
(4, 'Shifat E Rasul', 'Soft Spark Solution', '+8801871769835', '/uploads/users/6296883c-35e8-4744-815e-30a426f94872.png', 'shifaterasulbd@gmail.com', NULL, '$2y$12$a5BCsNRT2K/vwipc90K2lOgVc0x0whxxZPdzQ7l5lteEzhVvTQFA2', 'SXJwEyHv7AoYX6sjzsSxCmYl272qagAGLBbJ7XHIu6kuPcAJGYD0w1vHZSqM', '2026-06-04 00:26:33', '2026-06-05 01:59:33', NULL, '111752461072414542168'),
(5, 'Ghure Berai', 'Ghure Berai', '01871769835', NULL, 'shifatbdtravels@gmail.com', NULL, '$2y$12$UI5iJJNBCCxGkFVlPVdPNO8gVIQTmIhCMCvJpnOFKK923yfTZFrXS', NULL, '2026-06-04 02:00:55', '2026-06-04 02:17:44', NULL, '116378580619298217670');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject` (`subject_type`,`subject_id`),
  ADD KEY `causer` (`causer_type`,`causer_id`),
  ADD KEY `activity_log_log_name_index` (`log_name`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
