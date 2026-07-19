import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '../../styles/shopStyles';

const navItems = [
  { key: 'home', icon: '🏠', label: 'หน้าแรก' },
  { key: 'add', icon: '➕', label: 'เพิ่มสินค้า' },
  { key: 'rackets', icon: '🏸', label: 'ไม้แบด' },
  { key: 'categories', icon: '🏷️', label: 'หมวดหมู่' },
];

const BottomNav = ({ onAddPress, onHomePress }) => {
  const [active, setActive] = useState('rackets');
  const insets = useSafeAreaInsets();

  const handlePress = (item) => {
    if (item.key === 'add') {
      onAddPress?.();
      return;
    }
    if (item.key === 'home') {
      onHomePress?.();
      return;
    }
    setActive(item.key);
  };

  return (
    <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {navItems.map((item) => {
        const isActive = active === item.key;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.navItem}
            onPress={() => handlePress(item)}
          >
            <View style={[styles.navIconWrap, isActive && styles.navIconWrapActive]}>
              <Text style={[styles.navIcon, isActive && styles.navIconActive]}>{item.icon}</Text>
            </View>
            <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNav;
