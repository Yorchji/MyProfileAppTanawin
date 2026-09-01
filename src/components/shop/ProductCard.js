import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';

import { colors } from '../../styles/colors';
import { styles } from '../../styles/shopStyles';
import { buildImageSource } from '../../utils/image';

const ProductCard = ({ product, onEdit, canManage }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoading, setImageLoading] = useState(Boolean(product.image));

  // ถ้าลิงก์รูปของสินค้าเปลี่ยน (เช่น แก้ไขสินค้าแล้วใส่ลิงก์ใหม่) ให้รีเซ็ตสถานะ error/loading ใหม่
  // ไม่งั้นถ้ารูปเก่าเคยโหลดพังไว้ สถานะ imageFailed จะค้างและไม่ยอมลองโหลดรูปใหม่
  useEffect(() => {
    setImageFailed(false);
    setImageLoading(Boolean(product.image));
  }, [product.image]);

  // ถ้ารูปโหลดผ่าน proxy นานเกินไป (เช่น เน็ตช้า, ต้นทางไม่ตอบ) ให้เปลี่ยนไปโชว์ไอคอนสำรอง
  // แทนที่จะค้างเป็นกล่องว่างเปล่าตลอดไปโดยไม่มีอะไรบอกผู้ใช้เลย
  useEffect(() => {
    if (!imageLoading) return undefined;
    const timeoutId = setTimeout(() => {
      setImageLoading(false);
      setImageFailed(true);
    }, 10000);
    return () => clearTimeout(timeoutId);
  }, [imageLoading, product.image]);

  const hasImage = Boolean(product.image) && !imageFailed;

  return (
    <TouchableOpacity style={styles.card} onPress={() => canManage && onEdit?.(product)} activeOpacity={canManage ? 0.85 : 1}>
      <View style={styles.cardImageWrap}>
        {hasImage ? (
          <>
            <Image
              key={product.image}
              source={buildImageSource(product.image)}
              style={styles.cardImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
              onLoadStart={() => setImageLoading(true)}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageFailed(true);
                setImageLoading(false);
              }}
            />
            {imageLoading ? (
              <View style={styles.cardImageLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null}
          </>
        ) : (
          <Text style={styles.cardIcon}>{product.icon || '🏸'}</Text>
        )}
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardCategory}>{product.category}</Text>
        <Text style={styles.cardName} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.cardPriceBadge}>
          <Text style={styles.cardPrice}>฿{Number(product.price).toLocaleString()}</Text>
        </View>
      </View>

      {canManage ? <View style={styles.cardEditButton}><Text style={styles.cardEditButtonText}>✎</Text></View> : null}
    </TouchableOpacity>
  );
};

export default ProductCard;
