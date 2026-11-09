-- ใช้ครั้งเดียวกับฐานข้อมูลเดิมที่มีคอลัมน์ username
-- สำรองฐานข้อมูลก่อน แล้วรันคำสั่งนี้ใน phpMyAdmin
ALTER TABLE users CHANGE username email VARCHAR(254) NOT NULL;
ALTER TABLE users RENAME INDEX users_username_unique TO users_email_unique;
UPDATE users SET email = 'Tanawin.i@ku.th' WHERE email = 'Tanawin';
