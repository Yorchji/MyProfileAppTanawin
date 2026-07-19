import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Image } from 'expo-image';

import { colors } from '../../styles/colors';
import { styles } from '../../styles/shopStyles';
import { buildImageSource } from '../../utils/image';

const CATEGORY_ICONS = {
  'ไม้แบดมินตัน': '🏸',
  'ลูกขนไก่': '🏵️',
  'สายเอ็น': '🧵',
  'รองเท้าแบดมินตัน': '👟',
};

// ทำความสะอาดลิงก์ที่ผู้ใช้วางมา เผื่อกรณีที่ยังไม่ค่อยเป็นลิงก์รูปภาพตรง ๆ
// เช่น ลืมใส่ http/https, วางลิงก์แบบ // (protocol-relative), หรือคัดลอกมาจาก
// ผลการค้นหารูปของ Google (ลิงก์จะมี ...imgurl=<ลิงก์รูปจริง>&... ซ้อนอยู่ข้างใน)
const normalizeImageUrl = (rawValue) => {
  let value = (rawValue || '').trim();
  if (!value) return '';

  const imgUrlMatch = value.match(/[?&]imgurl=([^&]+)/i);
  if (imgUrlMatch) {
    try {
      value = decodeURIComponent(imgUrlMatch[1]);
    } catch {
      // ถ้า decode ไม่ได้ก็ใช้ค่าดิบต่อไป
    }
  }

  if (value.startsWith('//')) {
    value = `https:${value}`;
  }

  if (!/^https?:\/\//i.test(value) && /^[\w-]+(\.[\w-]+)+\/?/i.test(value)) {
    value = `https://${value}`;
  }

  return value;
};

const isLikelyImageUrl = (value) => /^https?:\/\/.+/i.test(value.trim());

const AddProductModal = ({ visible, onClose, onSubmit, initialProduct }) => {
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const [errors, setErrors] = useState({});

  // เมื่อเปิด modal (ทั้งโหมดเพิ่มใหม่และแก้ไข) ให้เติมข้อมูลในฟอร์มให้ตรงกับสินค้าที่จะแก้ไข
  useEffect(() => {
    if (!visible) return;

    if (initialProduct) {
      setName(initialProduct.name ?? '');
      setCategory(initialProduct.category ?? '');
      setPrice(initialProduct.price != null ? String(initialProduct.price) : '');
      setImageUrl(initialProduct.image ?? '');
    } else {
      setName('');
      setCategory('');
      setPrice('');
      setImageUrl('');
    }
    setImageFailed(false);
    setErrors({});
  }, [visible, initialProduct]);

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setImageUrl('');
    setImageFailed(false);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const cleanedUrl = normalizeImageUrl(imageUrl);

    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'กรุณากรอกชื่อสินค้า';
    if (!price.trim() || Number.isNaN(Number(price)) || Number(price) <= 0) {
      nextErrors.price = 'กรุณากรอกราคาเป็นตัวเลขที่ถูกต้อง';
    }
    if (imageUrl.trim() && !isLikelyImageUrl(cleanedUrl)) {
      nextErrors.imageUrl = 'ลิงก์รูปภาพต้องขึ้นต้นด้วย http:// หรือ https://';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // บันทึกรูปไว้แม้ว่าตอนพรีวิวจะยังโหลดไม่เสร็จ/โหลดไม่ขึ้นในโมดัลนี้
    // (บางลิงก์โหลดช้า หรือแพลตฟอร์มพรีวิวคนละตัวกับตอนแสดงผลจริง)
    // เพื่อไม่ให้รูปที่ถูกต้องหายไปเฉย ๆ ตอนกดบันทึก
    onSubmit({
      id: initialProduct?.id ?? Date.now().toString(),
      name: name.trim(),
      category: category.trim() || 'สินค้าทั่วไป',
      price: Number(price),
      image: cleanedUrl ? cleanedUrl : null,
      icon: CATEGORY_ICONS[category.trim()] || initialProduct?.icon || '🏸',
    });

    resetForm();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={{ width: '100%' }}
            >
              <View style={styles.modalCard}>
                <View style={styles.modalHandle} />

                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle}>{isEditing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</Text>
                  <TouchableOpacity style={styles.modalClose} onPress={handleClose}>
                    <Text style={styles.modalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                      {/* Image preview */}
                      <View style={styles.previewWrap}>
                        {imageUrl.trim() && isLikelyImageUrl(normalizeImageUrl(imageUrl)) && !imageFailed ? (
                          <Image
                            key={normalizeImageUrl(imageUrl)}
                            source={buildImageSource(normalizeImageUrl(imageUrl))}
                            style={styles.previewImage}
                            contentFit="cover"
                            onError={() => setImageFailed(true)}
                            onLoad={() => setImageFailed(false)}
                          />
                        ) : (
                          <View style={styles.previewPlaceholder}>
                            <Text style={styles.previewPlaceholderIcon}>🖼️</Text>
                            <Text style={styles.previewPlaceholderText}>
                              {imageFailed ? 'โหลดรูปไม่สำเร็จ ลองลิงก์อื่น' : 'ตัวอย่างรูปภาพจะแสดงที่นี่'}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.fieldLabel}>🔗 ลิงก์รูปภาพสินค้า (วางลิงก์รูปตรงนี้)</Text>
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="https://example.com/image.jpg"
                        placeholderTextColor={colors.textMuted}
                        value={imageUrl}
                        onChangeText={(value) => {
                          setImageUrl(value);
                          setImageFailed(false);
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="url"
                      />
                      <Text style={styles.fieldHint}>
                        ต้องเป็นลิงก์ตรงไปยังไฟล์รูปภาพ (ขึ้นต้นด้วย http:// หรือ https:// และมักลงท้ายด้วย .jpg .png .webp)
                        {'\n'}เคล็ดลับ: คลิกขวาที่รูป แล้วเลือก "คัดลอกที่อยู่ลิงก์รูปภาพ" (Copy image address) — อย่าคัดลอกลิงก์หน้าเว็บ
                        เพราะลิงก์แบบนั้นจะไม่ขึ้นรูป
                      </Text>
                      {errors.imageUrl ? <Text style={styles.fieldError}>{errors.imageUrl}</Text> : null}

                      <Text style={styles.fieldLabel}>ชื่อสินค้า *</Text>
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="เช่น Yonex Astrox 100ZZ"
                        placeholderTextColor={colors.textMuted}
                        value={name}
                        onChangeText={setName}
                      />
                      {errors.name ? <Text style={styles.fieldError}>{errors.name}</Text> : null}

                      <Text style={styles.fieldLabel}>หมวดหมู่</Text>
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="เช่น ไม้แบดมินตัน, ลูกขนไก่"
                        placeholderTextColor={colors.textMuted}
                        value={category}
                        onChangeText={setCategory}
                      />

                      <Text style={styles.fieldLabel}>ราคา (บาท) *</Text>
                      <TextInput
                        style={styles.fieldInput}
                        placeholder="เช่น 1990"
                        placeholderTextColor={colors.textMuted}
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                      />
                      {errors.price ? <Text style={styles.fieldError}>{errors.price}</Text> : null}

                      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>
                          {isEditing ? '✓ บันทึกการแก้ไข' : '+ เพิ่มสินค้า'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddProductModal;
