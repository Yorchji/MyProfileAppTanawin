import { StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../styles/colors';
import { styles } from '../../styles/shopStyles';

const ProductHeader = ({ search, onSearchChange, onAddPress, activeCategory, onFilterPress, canManage, user, onLogout }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <View style={styles.headerBlobOne} />
        <View style={styles.headerBlobTwo} />

        <View style={styles.menuButton}><Text style={styles.menuIcon}>{user?.role === 'admin' ? 'M' : 'U'}</Text></View>

        <View>
          <Text style={styles.headerTitle}>🏸 Minton store</Text>
          <Text style={styles.headerSubtitle}>{user?.username} • {canManage ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}</Text>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={onLogout}
          accessibilityRole="button"
          accessibilityLabel="ออกจากระบบ"
        >
          <Text style={styles.logoutButtonText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาไม้แบด, ลูกขนไก่, สายเอ็น..."
            placeholderTextColor={colors.textGray}
            value={search}
            onChangeText={onSearchChange}
            editable
          />
        </View>

        {canManage ? <TouchableOpacity style={styles.addButton} onPress={onAddPress}><Text style={styles.addButtonText}>+ เพิ่มสินค้า</Text></TouchableOpacity> : null}
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
          <Text style={styles.filterText}>{activeCategory ? `${activeCategory} ▾` : 'หมวดหมู่ ▼'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductHeader;
