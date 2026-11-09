import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../styles/colors';
import { styles } from '../styles/shopStyles';

const FEATURES = [
  {
    icon: '🏸',
    title: 'สินค้าครบวงจร',
    desc: 'ไม้แบด ลูกขนไก่ สายเอ็น รองเท้า และอุปกรณ์เสริมสำหรับนักแบดมินตันทุกระดับ',
  },
  {
    icon: '➕',
    title: 'เพิ่มสินค้าได้เอง',
    desc: 'จัดการร้านของคุณเอง เพิ่มชื่อ ราคา หมวดหมู่ และรูปภาพสินค้าได้ในไม่กี่ขั้นตอน',
  },
  {
    icon: '🖼️',
    title: 'แสดงรูปจากลิงก์จริง',
    desc: 'แปะลิงก์รูปภาพสินค้า ระบบจะโหลดและแสดงรูปจริงให้ทันที พร้อมระบบสำรองหากลิงก์เสีย',
  },
  {
    icon: '🔍',
    title: 'ค้นหาไว ใช้ง่าย',
    desc: 'ค้นหาสินค้าตามชื่อหรือหมวดหมู่ได้ทันที ไม่ต้องไล่เลื่อนหาทีละรายการ',
  },
];

const HomeInfoScreen = ({ onEnterShop }) => {
  return (
    <SafeAreaView style={styles.infoScreen} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.infoScroll}>
        {/* Hero */}
        <View style={styles.heroWrap}>
          <View style={styles.heroBlobOne} />
          <View style={styles.heroBlobTwo} />

          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>MY PROFILE APP</Text>
          </View>

          <Text style={styles.heroEmoji}>🏸</Text>
          <Text style={styles.heroTitle}>Minton Store</Text>
          <Text style={styles.heroSubtitle}>
            แอปจัดการร้านอุปกรณ์แบดมินตัน{'\n'}เพิ่ม แสดง และค้นหาสินค้าได้ในที่เดียว
          </Text>

          <TouchableOpacity style={styles.heroCta} onPress={onEnterShop} activeOpacity={0.85}>
            <Text style={styles.heroCtaText}>เข้าสู่ร้านค้า</Text>
            <Text style={styles.heroCtaArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>ปรับแต่งได้เอง</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>หมวดหมู่หลัก</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>∞</Text>
            <Text style={styles.statLabel}>เพิ่มสินค้าไม่จำกัด</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>แอปนี้ทำอะไรได้บ้าง</Text>

          {FEATURES.map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.infoBottomCta} onPress={onEnterShop} activeOpacity={0.85}>
          <Text style={styles.infoBottomCtaText}>เริ่มใช้งานร้านค้า</Text>
        </TouchableOpacity>

        <Text style={styles.infoFooter}>MyProfileAppTanawin • Made with React Native & Expo</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeInfoScreen;
