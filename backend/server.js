require('dotenv').config();

const bcrypt = require('bcryptjs');
const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const requiredEnv = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((name) => !process.env[name] || process.env[name].startsWith('your_') || process.env[name].startsWith('replace_'));
if (missingEnv.length) {
  console.error(`Missing or placeholder environment values: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const app = express();
const port = Number(process.env.PORT || 3057);
const tokenTtlHours = Number(process.env.TOKEN_TTL_HOURS || 24);
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4',
});

app.use(cors());
app.use(express.json({ limit: '100kb' }));

const createToken = (user) => jwt.sign(
  { id: user.id, username: user.username, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: `${tokenTtlHours}h` },
);

const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบ' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่' });
  }
};

const adminOnly = (req, res, next) => (
  req.user.role === 'admin'
    ? next()
    : res.status(403).json({ message: 'บัญชีนี้ไม่มีสิทธิ์จัดการสินค้า' })
);

const productValues = (body) => {
  const name = String(body.name || '').trim();
  const category = String(body.category || 'สินค้าทั่วไป').trim() || 'สินค้าทั่วไป';
  const price = Number(body.price);
  const image = body.image ? String(body.image).trim() : null;
  const icon = String(body.icon || '🏸').trim().slice(0, 16) || '🏸';
  if (!name || name.length > 255) return { error: 'ชื่อสินค้าต้องมีความยาว 1–255 ตัวอักษร' };
  if (category.length > 100) return { error: 'หมวดหมู่ยาวเกิน 100 ตัวอักษร' };
  if (!Number.isFinite(price) || price <= 0) return { error: 'ราคาสินค้าต้องมากกว่า 0' };
  if (image && !/^https?:\/\//i.test(image)) return { error: 'ลิงก์รูปภาพต้องขึ้นต้นด้วย http:// หรือ https://' };
  return { name, category, price, image, icon };
};

const toProduct = (row) => ({
  id: String(row.id), name: row.name, category: row.category, price: Number(row.price),
  image: row.image_url, icon: row.icon,
});

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'database_unavailable' });
  }
});

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    if (!/^[A-Za-z0-9_.-]{3,50}$/.test(username)) return res.status(400).json({ message: 'ชื่อผู้ใช้ต้องเป็นอังกฤษ/ตัวเลข 3–50 ตัวอักษร' });
    if (password.length < 8) return res.status(400).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' });
    const passwordHash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute('INSERT INTO users (username, password_hash, role) VALUES (?, ?, \'user\')', [username, passwordHash]);
    const user = { id: result.insertId, username, role: 'user' };
    return res.status(201).json({ token: createToken(user), user });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });
    return next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');
    const [rows] = await pool.execute('SELECT id, username, password_hash, role FROM users WHERE username = ? LIMIT 1', [username]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    return res.json({ token: createToken(user), user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) { return next(error); }
});

app.get('/api/products', auth, async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, category, price, image_url, icon FROM products ORDER BY created_at DESC, id DESC');
    return res.json(rows.map(toProduct));
  } catch (error) { return next(error); }
});

app.post('/api/products', auth, adminOnly, async (req, res, next) => {
  try {
    const product = productValues(req.body);
    if (product.error) return res.status(400).json({ message: product.error });
    const [result] = await pool.execute('INSERT INTO products (name, category, price, image_url, icon) VALUES (?, ?, ?, ?, ?)', [product.name, product.category, product.price, product.image, product.icon]);
    return res.status(201).json({ ...product, id: String(result.insertId) });
  } catch (error) { return next(error); }
});

app.put('/api/products/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const product = productValues(req.body);
    if (product.error) return res.status(400).json({ message: product.error });
    const [result] = await pool.execute('UPDATE products SET name = ?, category = ?, price = ?, image_url = ?, icon = ? WHERE id = ?', [product.name, product.category, product.price, product.image, product.icon, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'ไม่พบสินค้า' });
    return res.json({ ...product, id: String(req.params.id) });
  } catch (error) { return next(error); }
});

app.delete('/api/products/:id', auth, adminOnly, async (req, res, next) => {
  try {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'ไม่พบสินค้า' });
    return res.status(204).send();
  } catch (error) { return next(error); }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์' });
});

app.listen(port, () => console.log(`API server listening on port ${port}`));
