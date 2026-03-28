-- ============================================================
-- KNPOS Database Schema
-- Reconstructed from GraphQL model type definitions
-- Run this on a fresh MySQL database: kn_private
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ============================================================
-- CORE LOOKUP / REFERENCE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS `roles` (
  `id`          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `role_name`   VARCHAR(100) NOT NULL,
  `description` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed: role_id=1 is Super Admin (full menu access)
INSERT INTO `roles` (`id`, `role_name`, `description`) VALUES
(1, 'Super Admin', 'Full access'),
(2, 'Admin', 'Default admin role');

CREATE TABLE IF NOT EXISTS `tags` (
  `id`          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `tag_name`    VARCHAR(100) NOT NULL,
  `description` TEXT,
  `parent_id`   INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `categories` (
  `id`            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `category_name` VARCHAR(100) NOT NULL,
  `description`   TEXT,
  `parent_id`     INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `offices` (
  `id`             INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `office_name`    VARCHAR(200) NOT NULL,
  `office_address` TEXT,
  `status`         TINYINT(1) DEFAULT 1,
  `created_date`   DATETIME DEFAULT CURRENT_TIMESTAMP,
  `modified_date`  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_by`    INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `menu` (
  `id`           INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `route`        VARCHAR(255),
  `display_name` VARCHAR(100),
  `menu_icon`    VARCHAR(100),
  `parent_id`    INT DEFAULT NULL,
  `sort_order`   INT DEFAULT 0,
  `status`       INT DEFAULT 1,
  `is_default`   INT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `bank` (
  `id`          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten_bank`    VARCHAR(200),
  `ngay_ky_ket` DATE,
  `ho_so_file`  VARCHAR(500),
  `status`      INT DEFAULT 1,
  `soft_deleted` TINYINT(1) DEFAULT 0,
  `modified_by` INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `bank_branch` (
  `id`             INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `bank_id`        INT NOT NULL,
  `ten_chi_nhanh`  VARCHAR(200),
  `ma_chi_nhanh`   VARCHAR(100),
  `dia_chi`        TEXT,
  `loai_dvkd`      INT DEFAULT NULL,
  `ngay_bat_dau`   DATE,
  `ho_so_file`     VARCHAR(500),
  `status`         INT DEFAULT 1,
  `soft_deleted`   TINYINT(1) DEFAULT 0,
  `created_date`   DATETIME DEFAULT CURRENT_TIMESTAMP,
  `modified_date`  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_by`    INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Card types for a bank branch (dvkd_loai_the)
CREATE TABLE IF NOT EXISTS `dvkd_loai_the` (
  `id`                INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `chi_nhanh_bank_id` INT NOT NULL,
  `ten_the`           VARCHAR(100),
  `ten_doi_soat`      VARCHAR(100),
  `status`            INT DEFAULT 1,
  `soft_deleted`      INT DEFAULT 0,
  `created_date`      DATETIME DEFAULT CURRENT_TIMESTAMP,
  `modified_date`     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_by`       INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Fee rates configured per bank branch / business type / card type
CREATE TABLE IF NOT EXISTS `dvkd_fee_rate` (
  `id`                INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `chi_nhanh_bank_id` INT NOT NULL,
  `loai_hinh_kd_id`   INT DEFAULT NULL,
  `loai_the_id`       INT DEFAULT NULL,
  `phi_goc`           DECIMAL(10,4) DEFAULT 0,
  `phi_cai_pos`       DECIMAL(10,4) DEFAULT 0,
  `phi_ban_agent`     DECIMAL(10,4) DEFAULT 0,
  `ngay_bat_dau`      DATE,
  `ngay_ket_thuc`     DATE,
  `soft_deleted`      INT DEFAULT 0,
  `created_date`      DATETIME DEFAULT CURRENT_TIMESTAMP,
  `modified_date`     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_by`       INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Audit log for changes to bank branch fee rates
CREATE TABLE IF NOT EXISTS `dvkd_fee_rate_log` (
  `id`                INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `dvkd_fee_rate_id`  INT NOT NULL,
  `chi_nhanh_bank_id` INT NOT NULL,
  `thong_tin_cu`      TEXT,
  `thong_tin_moi`     TEXT,
  `timestamp`         DATETIME DEFAULT CURRENT_TIMESTAMP,
  `user_id`           INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `merchant_bus_type` (
  `id`     INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten`    VARCHAR(200),
  `status` INT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pos_provider` (
  `id`          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten`         VARCHAR(200),
  `dia_chi`     TEXT,
  `status`      INT DEFAULT 1,
  `soft_deleted` TINYINT(1) DEFAULT 0,
  `modified_by` INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `supplier_pos` (
  `id`          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten`         VARCHAR(200),
  `dia_chi`     TEXT,
  `status`      INT DEFAULT 1,
  `soft_deleted` TINYINT(1) DEFAULT 0,
  `modified_by` INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- POS machine models (table: supplier_pos_model)
CREATE TABLE IF NOT EXISTS `supplier_pos_model` (
  `id`          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `supplier_id` INT NOT NULL,
  `ten`         VARCHAR(200),
  `status`      INT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- USER MANAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS `users` (
  `id`            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email`         VARCHAR(255) NOT NULL,
  `password`      VARCHAR(255) NOT NULL,
  `user_name`     VARCHAR(200) NOT NULL,
  `status`        TINYINT(1) NOT NULL DEFAULT 1,
  `created_date`  DATETIME DEFAULT CURRENT_TIMESTAMP,
  `modified_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `manager_id`    INT NOT NULL DEFAULT 0,
  `user_vendor_id` INT DEFAULT NULL,
  `gender`        INT DEFAULT NULL,
  `birthday`      DATE,
  `phone_number`  VARCHAR(20),
  `f_image`       VARCHAR(500),
  `access_token`  VARCHAR(500),
  `soft_deleted`  TINYINT(1) NOT NULL DEFAULT 0,
  `kn_office_id`  INT DEFAULT NULL,
  `modified_by`   INT DEFAULT NULL,
  UNIQUE KEY `uq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_role` (
  `id`      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_tag` (
  `id`      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `tag_id`  INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_category` (
  `id`          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id`     INT NOT NULL,
  `category_id` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Per-user menu permissions
CREATE TABLE IF NOT EXISTS `user_permission` (
  `id`         INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id`    INT NOT NULL,
  `menu_id`    INT NOT NULL,
  `permission` INT DEFAULT 0,  -- 0=none, 1=read, 2=write
  `is_default` INT DEFAULT 1,
  `status`     INT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Per-role menu permissions
CREATE TABLE IF NOT EXISTS `role_permission` (
  `id`         INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `role_id`    INT NOT NULL,
  `menu_id`    INT NOT NULL,
  `permission` INT DEFAULT 0,
  `status`     INT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- AGENT
-- ============================================================

CREATE TABLE IF NOT EXISTS `agent` (
  `id`             INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten_dai_ly`     VARCHAR(200),
  `ten_dai_dien`   VARCHAR(200),
  `gioi_tinh`      VARCHAR(10),
  `ngay_sinh`      DATE,
  `so_cccd`        VARCHAR(50),
  `ngay_cap`       DATE,
  `noi_cap`        VARCHAR(200),
  `dia_chi`        TEXT,
  `sdt`            VARCHAR(20),
  `email`          VARCHAR(255),
  `ngay_bat_dau`   DATE,
  `ngay_ket_thuc`  DATE,
  `hop_dong`       VARCHAR(500),
  `kn_office_id`   INT DEFAULT NULL,
  `status`         INT DEFAULT 1,
  `soft_deleted`   TINYINT(1) DEFAULT 0,
  `created_date`   DATETIME DEFAULT CURRENT_TIMESTAMP,
  `modified_date`  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_by`    INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- CLIENT
-- ============================================================

CREATE TABLE IF NOT EXISTS `client` (
  `id`              INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten`             VARCHAR(200),
  `type`            INT DEFAULT NULL,
  `maso`            VARCHAR(100),
  `maso_dk`         VARCHAR(100),
  `ngay_cap_dk`     DATE,
  `noi_cap_dk`      VARCHAR(200),
  `diachi_kinhdoanh` TEXT,
  `quan_huyen`      VARCHAR(200),
  `tinh_tp`         VARCHAR(200),
  `loai_hinh_kd`   INT DEFAULT NULL,
  `chu_ho_kd`       VARCHAR(200),
  `gioi_tinh`       VARCHAR(10),
  `ngay_sinh`       DATE,
  `so_cccd`         VARCHAR(50),
  `ngay_cap`        DATE,
  `noi_cap`         VARCHAR(200),
  `dia_chi`         TEXT,
  `sdt`             VARCHAR(20),
  `email`           VARCHAR(255),
  `status`          INT DEFAULT 0,  -- 0-active, 1-deactive
  `soft_deleted`    TINYINT(1) DEFAULT 0,
  `created_date`    DATETIME DEFAULT CURRENT_TIMESTAMP,
  `modified_date`   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_by`     INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- MERCHANT
-- ============================================================

CREATE TABLE IF NOT EXISTS `merchant` (
  `id`              INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `kn_office_id`    INT NOT NULL,
  `agent_id`        INT DEFAULT NULL,
  `client_id`       INT DEFAULT NULL,
  `chi_nhanh_bank_id` INT DEFAULT NULL,
  `loai_hinh_kd`   INT DEFAULT NULL,
  `link_ho_so`      VARCHAR(500),
  `status`          INT DEFAULT 0,
  -- 0-Khởi tạo; 1-Đang xử lý tại KN; 2-Xử lý tại ngân hàng;
  -- 3-Đã duyệt; 4-Đã cấp POS; 5-Đóng & thu hồi; 6-Từ chối; 7-Hoàn tất đóng
  `soft_deleted`    TINYINT(1) DEFAULT 0,
  `created_date`    DATETIME DEFAULT CURRENT_TIMESTAMP,
  `modified_date`   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_by`     INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `merchant_log` (
  `id`            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `merchant_id`   INT NOT NULL,
  `user_id`       INT NOT NULL,
  `sort_order`    INT DEFAULT 0,
  `activity_type` VARCHAR(100),
  `description`   TEXT,
  `attachments`   TEXT,
  `timestamp`     DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `merchant_checklist` (
  `id`                   INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `merchant_status`      INT DEFAULT NULL,
  `loai_hinh_kd_id`      INT DEFAULT NULL,
  `bank_id`              INT DEFAULT NULL,
  `chi_nhanh_bank_id`    INT DEFAULT NULL,
  `text`                 TEXT,
  `checklist_description` TEXT,
  `status`               INT DEFAULT 1,
  `required`             INT DEFAULT 0,
  `has_description`      INT DEFAULT 0,
  `description_label`    VARCHAR(200),
  `has_attachment`       INT DEFAULT 0,
  `attachment_label`     VARCHAR(200),
  `sort_order`           INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `merchant_checklist_process` (
  `id`            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `checklist_id`  INT DEFAULT NULL,
  `merchant_id`   INT DEFAULT NULL,
  `description`   TEXT,
  `status`        INT DEFAULT 0,  -- 0-not completed, 1-completed
  `modified_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_by`   INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `merchant_attachment` (
  `id`                   INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `checklist_process_id` INT DEFAULT NULL,
  `attachments`          TEXT,
  `file_name`            VARCHAR(500),
  `created_date`         DATETIME DEFAULT CURRENT_TIMESTAMP,
  `uploaded_by`          INT DEFAULT NULL,
  `status`               INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- MERCHANT BANK (POS assignment to bank branch)
-- ============================================================

CREATE TABLE IF NOT EXISTS `merchant_bank` (
  `id`              INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `merchant_id`     INT NOT NULL,
  `pos_id`          INT NOT NULL,
  `bank_id`         INT DEFAULT NULL,
  `ten_hkd_bank`    VARCHAR(200),
  `mid`             VARCHAR(100),
  `tid`             VARCHAR(100),
  `ngay_ra_ts`      DATE,
  `status`          INT DEFAULT 0,  -- 0-Chờ, 1-Đã cấp, 2-Thu hồi, 3-Đóng
  `soft_deleted`    TINYINT(1) DEFAULT 0,
  `modified_by`     INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `merchant_bank_account` (
  `id`               INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `merchant_id`      INT DEFAULT NULL,
  `merchant_bank_id` INT DEFAULT NULL,
  `chu_tk`           VARCHAR(200),
  `stk`              VARCHAR(100),
  `ngan_hang`        VARCHAR(200),
  `chi_nhanh`        VARCHAR(200),
  `email_bc`         VARCHAR(255),
  `thoi_gian_hl`     VARCHAR(100),
  `ca_hl`            VARCHAR(100),
  `modified_date`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_by`      INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `merchant_bank_account_log` (
  `id`               INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `merchant_id`      INT DEFAULT NULL,
  `merchant_bank_id` INT DEFAULT NULL,
  `thong_tin_cu`     TEXT,
  `thong_tin_moi`    TEXT,
  `timestamp`        DATETIME DEFAULT CURRENT_TIMESTAMP,
  `user_id`          INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `merchant_bank_pos` (
  `id`                  INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `merchant_id`         INT DEFAULT NULL,
  `merchant_bank_id`    INT DEFAULT NULL,
  `pos_id`              INT DEFAULT NULL,
  `user_id_ban_giao`    INT DEFAULT NULL,
  `ngay_ban_giao`       DATE,
  `user_id_thu_hoi`     INT DEFAULT NULL,
  `ngay_thu_hoi`        DATE,
  `ly_do_thu_hoi`       INT DEFAULT NULL,
  `status`              INT DEFAULT 0,  -- 0-Chờ, 1-Đã cấp, 2-Thu hồi
  `soft_deleted`        TINYINT(1) DEFAULT 0,
  `modified_by`         INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- MERCHANT FEE RATES
-- ============================================================

CREATE TABLE IF NOT EXISTS `merchant_fee_rate` (
  `id`            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `merchant_id`   INT NOT NULL,
  `loai_the_id`   INT DEFAULT NULL,
  `phi_cai_pos`   DECIMAL(10,4) DEFAULT 0,
  `phi_ban_agent` DECIMAL(10,4) DEFAULT 0,
  `ngay_bat_dau`  DATE,
  `ngay_ket_thuc` DATE,
  `soft_deleted`  INT DEFAULT 0,
  `created_date`  DATETIME DEFAULT CURRENT_TIMESTAMP,
  `modified_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_by`   INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `merchant_fee_rate_log` (
  `id`                   INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `merchant_id`          INT NOT NULL,
  `merchant_fee_rate_id` INT NOT NULL,
  `thong_tin_cu`         TEXT,
  `thong_tin_moi`        TEXT,
  `timestamp`            DATETIME DEFAULT CURRENT_TIMESTAMP,
  `user_id`              INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- POS
-- ============================================================

CREATE TABLE IF NOT EXISTS `pos_contract` (
  `id`            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `so_hd`         VARCHAR(100),
  `provider_id`   INT DEFAULT NULL,
  `supplier_id`   INT DEFAULT NULL,
  `loai_may_id`   INT DEFAULT NULL,
  `ngay_ky`       DATE,
  `attachments`   TEXT,
  `status`        INT DEFAULT 0,  -- 0-đang cấp, 1-đã cấp, 2-hoàn thành
  `soft_deleted`  TINYINT(1) DEFAULT 0,
  `created_date`  DATETIME DEFAULT CURRENT_TIMESTAMP,
  `modified_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `modified_by`   INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pos_contract_log` (
  `id`            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `contract_id`   INT NOT NULL,
  `user_id`       INT DEFAULT NULL,
  `activity_type` VARCHAR(100),
  `description`   TEXT,
  `timestamp`     DATETIME DEFAULT CURRENT_TIMESTAMP,
  `attachments`   TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pos` (
  `id`              INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `bank_id`         INT DEFAULT NULL,
  `supplier_id`     INT DEFAULT NULL,
  `contract_id`     INT DEFAULT NULL,
  `loai_may_id`     INT DEFAULT NULL,
  `kn_office_id`    INT DEFAULT NULL,
  `seri`            VARCHAR(100),
  `ngay_nhap_kho`   DATE,
  `loai_kho`        INT DEFAULT 0,  -- 0-thực nhận, 1-Ký gửi
  `ngay_thanh_toan` DATE,
  `thanh_toan`      INT DEFAULT 0,  -- 0-chưa TT, 1-đã TT
  `ngay_hoan_tra`   DATE,
  `hoan_tra`        INT DEFAULT 0,  -- 0-chưa hoàn trả, 1-đã hoàn trả
  `status`          INT DEFAULT 0,
  -- 0-sẵn, 1-đã đăng ký, 2-đã cấp, 3-hỏng, 4-đang thu hồi, 5-thanh lý
  `modified_by`     INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pos_log` (
  `id`            INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `pos_id`        INT NOT NULL,
  `user_id`       INT DEFAULT NULL,
  `activity_type` VARCHAR(100),
  `description`   TEXT,
  `timestamp`     DATETIME DEFAULT CURRENT_TIMESTAMP,
  `attachments`   TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TRANSACTION
-- ============================================================

CREATE TABLE IF NOT EXISTS `transaction` (
  `id`           INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ten_dvcnt`    VARCHAR(200),
  `mid`          VARCHAR(100),
  `tid`          VARCHAR(100),
  `date_from`    DATE,
  `date_to`      DATE,
  `so_gd`        INT DEFAULT NULL,
  `time_gd`      VARCHAR(50),
  `tong_gd`      VARCHAR(50),
  `tong_bc`      VARCHAR(50),
  `tong_phi`     VARCHAR(50),
  `bank_id`      INT DEFAULT NULL,
  `so_the`       VARCHAR(100),
  `so_tien_gd`   BIGINT DEFAULT NULL,
  `so_tien_bc`   BIGINT DEFAULT NULL,
  `so_tien_phi`  BIGINT DEFAULT NULL,
  `time_bc`      VARCHAR(50),
  `loai_the`     VARCHAR(100),
  `ma_chuan_chi` VARCHAR(100),
  `so_but_toan`  VARCHAR(100),
  `so_tc`        VARCHAR(100),
  `batch`        VARCHAR(100),
  `timestamp`    DATETIME DEFAULT CURRENT_TIMESTAMP,
  `section_id`   VARCHAR(100),
  `user_id`      INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- INITIAL DATA: Create first admin user
-- Password below is bcrypt hash of "Admin@123" (12 rounds)
-- Change it immediately after first login
-- ============================================================

INSERT INTO `offices` (`office_name`, `office_address`, `status`) VALUES
('Head Office', '123 Main Street', 1);

INSERT INTO `users` (`email`, `password`, `user_name`, `status`, `manager_id`, `soft_deleted`, `kn_office_id`) VALUES
('admin@knpos.local', '$2a$12$92cQFJibjuISyKGGSuNCAOsKKJk8dVDRxqvjzJU.MRbEbJRijV2XO', 'Admin', 1, 0, 0, 1);
-- Default password is: Admin@123

INSERT INTO `user_role` (`user_id`, `role_id`) VALUES (1, 1);

-- ============================================================
-- MENU ITEMS (common routes from the Vue router)
-- ============================================================
INSERT INTO `menu` (`route`, `display_name`, `menu_icon`, `parent_id`, `sort_order`, `status`, `is_default`) VALUES
('/dashboard', 'Dashboard', 'dashboard', NULL, 1, 1, 1),
('/users', 'Quản lý người dùng', 'person', NULL, 2, 1, 1),
('/merchants', 'Quản lý Merchant', 'store', NULL, 3, 1, 1),
('/pos', 'Quản lý POS', 'point_of_sale', NULL, 4, 1, 1),
('/transactions', 'Giao dịch', 'receipt_long', NULL, 5, 1, 1),
('/banks', 'Ngân hàng', 'account_balance', NULL, 6, 1, 1),
('/agents', 'Đại lý', 'group', NULL, 7, 1, 1),
('/offices', 'Văn phòng', 'business', NULL, 8, 1, 1);
