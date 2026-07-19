// เว็บร้านค้าหลายแห่ง (เช่น Yonex, Lazada, ร้านค้าออนไลน์ทั่วไป) จะบล็อกการโหลดรูปภาพ
// ถ้า request ไม่ได้มาจากเบราว์เซอร์จริง ๆ (เช่นมีระบบป้องกันบอทของ Cloudflare)
// การใส่แค่ header User-Agent อาจไม่พอ จึงใช้วิธีที่เชื่อถือได้กว่า คือส่ง request
// ผ่านบริการ proxy รูปภาพสาธารณะ (wsrv.nl) แทน ซึ่งจะไปโหลดรูปจากต้นทางให้แล้วส่งต่อมาให้แอป
// วิธีนี้ยังช่วยแก้ปัญหา CORS ตอนรันบนเว็บ (Expo web) ไปในตัวด้วย
const IMAGE_PROXY_BASE = 'https://wsrv.nl/';

export const IMAGE_REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

// แปลงลิงก์รูปภายนอกให้วิ่งผ่าน proxy ก่อนเสมอ เพื่อเลี่ยงปัญหาเว็บต้นทางบล็อกการโหลดรูป
export const proxyImageUrl = (uri) => {
  if (!uri) return uri;
  // ถ้าเป็นลิงก์ผ่าน proxy อยู่แล้ว ไม่ต้องห่อซ้ำ
  if (uri.startsWith(IMAGE_PROXY_BASE)) return uri;
  return `${IMAGE_PROXY_BASE}?url=${encodeURIComponent(uri)}&default=${encodeURIComponent(uri)}`;
};

// ห่อลิงก์รูปให้เป็น source object พร้อม header ที่เหมาะสม ใช้ได้ทั้งกับ
// AddProductModal (พรีวิว) และ ProductCard (แสดงในรายการ)
export const buildImageSource = (uri) => ({
  uri: proxyImageUrl(uri),
  headers: IMAGE_REQUEST_HEADERS,
});
