import { Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { styles } from '../../styles/shopStyles';

// โมดัลเลือกหมวดหมู่แบบ bottom sheet — แสดง "ทั้งหมด" และหมวดหมู่ที่มีสินค้าอยู่จริง
// พร้อมจำนวนสินค้าในแต่ละหมวดหมู่ ให้ผู้ใช้แตะเพื่อกรองรายการสินค้า
const CategoryFilterModal = ({ visible, categories, activeCategory, onSelect, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalCard}>
              <View style={styles.modalHandle} />

              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>เลือกหมวดหมู่</Text>
                <TouchableOpacity style={styles.modalClose} onPress={onClose}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={[styles.categoryModalItem, !activeCategory && styles.categoryModalItemActive]}
                  onPress={() => onSelect(null)}
                >
                  <Text
                    style={[
                      styles.categoryModalItemText,
                      !activeCategory && styles.categoryModalItemTextActive,
                    ]}
                  >
                    ทั้งหมด
                  </Text>
                  <Text
                    style={[
                      styles.categoryModalItemCount,
                      !activeCategory && styles.categoryModalItemTextActive,
                    ]}
                  >
                    {categories.reduce((sum, item) => sum + item.count, 0)}
                  </Text>
                </TouchableOpacity>

                {categories.map((item) => (
                  <TouchableOpacity
                    key={item.name}
                    style={[
                      styles.categoryModalItem,
                      activeCategory === item.name && styles.categoryModalItemActive,
                    ]}
                    onPress={() => onSelect(item.name)}
                  >
                    <Text
                      style={[
                        styles.categoryModalItemText,
                        activeCategory === item.name && styles.categoryModalItemTextActive,
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.categoryModalItemCount,
                        activeCategory === item.name && styles.categoryModalItemTextActive,
                      ]}
                    >
                      {item.count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CategoryFilterModal;
