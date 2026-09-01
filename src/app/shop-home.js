import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AddProductModal from '../components/shop/AddProductModal';
import BottomNav from '../components/shop/BottomNav';
import CategoryFilterModal from '../components/shop/CategoryFilterModal';
import ProductCard from '../components/shop/ProductCard';
import ProductHeader from '../components/shop/ProductHeader';
import { api } from '../services/api';
import { styles } from '../styles/shopStyles';

const ShopHomeScreen = ({ auth, onGoHome, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const canManage = auth.user.role === 'admin';

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try { setProducts(await api.products(auth.token)); }
    catch (error) { Alert.alert('โหลดสินค้าไม่สำเร็จ', error.message, [{ text: 'ออกจากระบบ', style: 'destructive', onPress: onLogout }, { text: 'ลองใหม่', onPress: loadProducts }]); }
    finally { setLoading(false); }
  }, [auth.token, onLogout]);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => (!query || product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)) && (!selectedCategory || product.category === selectedCategory));
  }, [products, search, selectedCategory]);
  const categoryOptions = useMemo(() => {
    const counts = new Map();
    products.forEach((product) => { const name = product.category || 'สินค้าทั่วไป'; counts.set(name, (counts.get(name) || 0) + 1); });
    return [...counts].map(([name, count]) => ({ name, count }));
  }, [products]);
  const groupedProducts = useMemo(() => {
    const groups = new Map();
    filteredProducts.forEach((product) => { const name = product.category || 'สินค้าทั่วไป'; groups.set(name, [...(groups.get(name) || []), product]); });
    return [...groups].map(([name, items]) => ({ name, items }));
  }, [filteredProducts]);
  const closeModal = () => { setModalVisible(false); setEditingProduct(null); };
  const openAddModal = () => { setEditingProduct(null); setModalVisible(true); };
  const openEditModal = (product) => { if (canManage) { setEditingProduct(product); setModalVisible(true); } };
  const handleSaveProduct = async (product) => {
    setSubmitting(true);
    try {
      const saved = product.id ? await api.updateProduct(auth.token, product) : await api.createProduct(auth.token, product);
      setProducts((current) => product.id ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
      closeModal();
    } catch (error) { Alert.alert('บันทึกไม่สำเร็จ', error.message); }
    finally { setSubmitting(false); }
  };
  const handleDeleteProduct = async (product) => {
    setSubmitting(true);
    try { await api.deleteProduct(auth.token, product.id); setProducts((current) => current.filter((item) => item.id !== product.id)); closeModal(); }
    catch (error) { Alert.alert('ลบไม่สำเร็จ', error.message); }
    finally { setSubmitting(false); }
  };

  return <View style={styles.screen}>
    <ProductHeader search={search} onSearchChange={setSearch} onAddPress={openAddModal} activeCategory={selectedCategory} onFilterPress={() => setCategoryModalVisible(true)} canManage={canManage} user={auth.user} onLogout={onLogout} />
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.listContent}>
      <View style={styles.sectionTitleRow}><Text style={styles.sectionTitle}>{selectedCategory || 'สินค้าแนะนำ'}</Text><Text style={styles.sectionCount}>{filteredProducts.length} รายการ</Text></View>
      {canManage && filteredProducts.length > 0 ? <Text style={styles.sectionHint}>แตะที่สินค้าเพื่อแก้ไขหรือลบสินค้า</Text> : null}
      {loading ? <View style={styles.emptyState}><Text style={styles.emptyText}>กำลังโหลดสินค้า...</Text></View> : filteredProducts.length === 0 ? <View style={styles.emptyState}><Text style={styles.emptyEmoji}>🔍</Text><Text style={styles.emptyText}>{products.length ? 'ไม่พบสินค้าที่ค้นหา' : 'ยังไม่มีสินค้าในร้าน'}</Text></View> : selectedCategory ? filteredProducts.map((product) => <ProductCard key={product.id} product={product} onEdit={openEditModal} canManage={canManage} />) : groupedProducts.map((group) => <View key={group.name} style={styles.categoryGroup}><View style={styles.categoryGroupHeaderRow}><Text style={styles.categoryGroupTitle}>{group.name}</Text><Text style={styles.categoryGroupCount}>{group.items.length} รายการ</Text></View>{group.items.map((product) => <ProductCard key={product.id} product={product} onEdit={openEditModal} canManage={canManage} />)}</View>)}
    </ScrollView>
    {canManage ? <TouchableOpacity style={styles.fab} onPress={openAddModal}><Text style={styles.fabIcon}>+</Text></TouchableOpacity> : null}
    <BottomNav onAddPress={openAddModal} onHomePress={onGoHome} canManage={canManage} />
    <AddProductModal visible={modalVisible} onClose={closeModal} onSubmit={handleSaveProduct} onDelete={handleDeleteProduct} initialProduct={editingProduct} submitting={submitting} />
    <CategoryFilterModal visible={categoryModalVisible} categories={categoryOptions} activeCategory={selectedCategory} onSelect={(category) => { setSelectedCategory(category); setCategoryModalVisible(false); }} onClose={() => setCategoryModalVisible(false)} />
  </View>;
};
export default ShopHomeScreen;
