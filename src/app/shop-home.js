import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AddProductModal from '../components/shop/AddProductModal';
import BottomNav from '../components/shop/BottomNav';
import CategoryFilterModal from '../components/shop/CategoryFilterModal';
import ProductCard from '../components/shop/ProductCard';
import ProductHeader from '../components/shop/ProductHeader';
import { products as initialProducts } from '../data/products';
import { styles } from '../styles/shopStyles';

// key ที่ใช้บันทึกรายการสินค้าไว้ในเครื่อง เพื่อให้เปิดแอปใหม่แล้วสินค้ายังอยู่
const PRODUCTS_STORAGE_KEY = 'shop_products_v1';

const ShopHomeScreen = ({ onGoHome }) => {
  const [products, setProducts] = useState(initialProducts);
  const [isHydrated, setIsHydrated] = useState(false);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  // โหลดสินค้าที่เคยบันทึกไว้ตอนเปิดแอปครั้งแรก (ทำครั้งเดียว)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (isMounted && saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setProducts(parsed);
          }
        }
      } catch (error) {
        // ถ้าโหลดไม่สำเร็จ ให้ใช้รายการเริ่มต้นไปก่อน ไม่ต้องทำให้แอปพัง
        console.warn('โหลดข้อมูลสินค้าที่บันทึกไว้ไม่สำเร็จ', error);
      } finally {
        if (isMounted) setIsHydrated(true);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // ทุกครั้งที่รายการสินค้าเปลี่ยน (เพิ่ม/แก้ไข) ให้บันทึกลงเครื่องอัตโนมัติ
  // รอให้โหลดข้อมูลเดิมเสร็จก่อน (isHydrated) ไม่งั้นจะเอาค่าว่างเริ่มต้นไปทับข้อมูลที่เคยบันทึกไว้
  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products)).catch((error) => {
      console.warn('บันทึกข้อมูลสินค้าไม่สำเร็จ', error);
    });
  }, [products, isHydrated]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // รายชื่อหมวดหมู่ทั้งหมดที่มีสินค้าอยู่จริง พร้อมจำนวนสินค้าในแต่ละหมวดหมู่
  // ใช้ข้อมูลจาก products ทั้งหมด (ไม่กรองตามคำค้นหา) เพื่อให้ตัวเลือกในโมดัลไม่กระโดดหายไปมา
  const categoryOptions = useMemo(() => {
    const order = [];
    const counts = new Map();
    products.forEach((product) => {
      const name = product.category || 'สินค้าทั่วไป';
      if (!counts.has(name)) {
        order.push(name);
        counts.set(name, 0);
      }
      counts.set(name, counts.get(name) + 1);
    });
    return order.map((name) => ({ name, count: counts.get(name) }));
  }, [products]);

  // จัดกลุ่มสินค้าที่ผ่านการกรองแล้ว แยกเป็นรายการต่อหมวดหมู่ เรียงตามลำดับที่สินค้าปรากฏก่อน-หลัง
  const groupedProducts = useMemo(() => {
    const order = [];
    const groups = new Map();
    filteredProducts.forEach((product) => {
      const name = product.category || 'สินค้าทั่วไป';
      if (!groups.has(name)) {
        order.push(name);
        groups.set(name, []);
      }
      groups.get(name).push(product);
    });
    return order.map((name) => ({ name, items: groups.get(name) }));
  }, [filteredProducts]);

  const openCategoryModal = () => setCategoryModalVisible(true);
  const closeCategoryModal = () => setCategoryModalVisible(false);
  const handleSelectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setCategoryModalVisible(false);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setModalVisible(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (productData) => {
    setProducts((prev) => {
      const exists = prev.some((item) => item.id === productData.id);
      if (exists) {
        return prev.map((item) => (item.id === productData.id ? productData : item));
      }
      return [productData, ...prev];
    });
    closeModal();
  };

  return (
    <View style={styles.screen}>
      <ProductHeader
        search={search}
        onSearchChange={setSearch}
        onAddPress={openAddModal}
        activeCategory={selectedCategory}
        onFilterPress={openCategoryModal}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.listContent}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? selectedCategory : 'สินค้าแนะนำ'}
          </Text>
          <Text style={styles.sectionCount}>{filteredProducts.length} รายการ</Text>
        </View>

        {filteredProducts.length > 0 ? (
          <Text style={styles.sectionHint}>แตะที่สินค้าเพื่อแก้ไขข้อมูลหรือใส่ลิงก์รูปภาพ</Text>
        ) : null}

        {!isHydrated ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>กำลังโหลดสินค้า...</Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          products.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🛍️</Text>
              <Text style={styles.emptyText}>ยังไม่มีสินค้าในร้าน</Text>
              <Text style={styles.emptyText}>กดปุ่ม + เพื่อเพิ่มสินค้าชิ้นแรกของคุณ</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>ไม่พบสินค้าที่ค้นหา</Text>
            </View>
          )
        ) : selectedCategory ? (
          // เลือกหมวดหมู่เดียวอยู่แล้ว แสดงเป็นรายการเดียวไม่ต้องซ้ำหัวข้อหมวดหมู่
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onEdit={openEditModal} />
          ))
        ) : (
          // ไม่ได้เลือกหมวดหมู่ แสดงสินค้าแยกเป็นหมวดหมู่ ๆ ไป
          groupedProducts.map((group) => (
            <View key={group.name} style={styles.categoryGroup}>
              <View style={styles.categoryGroupHeaderRow}>
                <Text style={styles.categoryGroupTitle}>{group.name}</Text>
                <Text style={styles.categoryGroupCount}>{group.items.length} รายการ</Text>
              </View>
              {group.items.map((product) => (
                <ProductCard key={product.id} product={product} onEdit={openEditModal} />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openAddModal} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <BottomNav onAddPress={openAddModal} onHomePress={onGoHome} />

      <AddProductModal
        visible={modalVisible}
        onClose={closeModal}
        onSubmit={handleSaveProduct}
        initialProduct={editingProduct}
      />

      <CategoryFilterModal
        visible={categoryModalVisible}
        categories={categoryOptions}
        activeCategory={selectedCategory}
        onSelect={handleSelectCategory}
        onClose={closeCategoryModal}
      />
    </View>
  );
};

export default ShopHomeScreen;
