import { API_BASE_URL } from '../config/api';

const request = async (path, { token, method = 'GET', body } = {}) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตและ backend');
  }
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || 'คำขอไม่สำเร็จ');
  return data;
};

export const api = {
  // ส่ง username เดิมไปพร้อมกันชั่วคราว เพื่อให้แอปยังใช้ได้กับ backend ที่ยังไม่ได้อัปเดต
  // Backend เวอร์ชันใหม่จะใช้เฉพาะ email และไม่สนใจ username
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: { email, password, username: email.toLowerCase() === 'tanawin.i@ku.th' ? 'Tanawin' : email },
  }),
  register: (email, password) => request('/auth/register', { method: 'POST', body: { email, password } }),
  products: (token) => request('/products', { token }),
  createProduct: (token, product) => request('/products', { token, method: 'POST', body: product }),
  updateProduct: (token, product) => request(`/products/${product.id}`, { token, method: 'PUT', body: product }),
  deleteProduct: (token, id) => request(`/products/${id}`, { token, method: 'DELETE' }),
};
