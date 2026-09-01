-- เลือกฐานข้อมูล ip_std6730202629 ใน phpMyAdmin แล้ววางไฟล์นี้ในแท็บ SQL
-- ตารางผู้ใช้: role เป็น admin หรือ user เท่านั้น
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_username_unique (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'สินค้าทั่วไป',
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT NULL,
  icon VARCHAR(16) NOT NULL DEFAULT '🏸',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT products_price_positive CHECK (price > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- บัญชีผู้ดูแลเริ่มต้น
-- username: Tanawin | password: Tanawin12345
-- เปลี่ยนรหัสผ่านนี้ทันทีหลังใช้งานครั้งแรก
INSERT INTO users (username, password_hash, role)
VALUES ('Tanawin', '$2b$10$PKEPfsvQLnFJTohTA8dJw.4EgOAj.r5DEomWAzM8YySOLZHBRl8he', 'admin')
ON DUPLICATE KEY UPDATE username = username;
