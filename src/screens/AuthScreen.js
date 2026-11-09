import { useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '../services/api';
import { colors } from '../styles/colors';

const AuthScreen = ({ onAuthenticated }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('กรุณากรอกอีเมลให้ถูกต้อง');
      return;
    }
    if (!isLogin && password.length < 8) {
      setErrorMessage('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }
    if (!isLogin && password !== confirmPassword) {
      setErrorMessage('ยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      const result = mode === 'login'
        ? await api.login(email.trim(), password)
        : await api.register(email.trim(), password);
      onAuthenticated(result);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const changeMode = () => {
    setMode((current) => (current === 'login' ? 'register' : 'login'));
    setPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  const isLogin = mode === 'login';
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.logo}>🏸</Text>
          <Text style={styles.title}>Minton Store</Text>
          <Text style={styles.subtitle}>{isLogin ? 'เข้าสู่ระบบเพื่อดูสินค้า' : 'สมัครสมาชิกเพื่อเริ่มใช้งาน'}</Text>

          <Text style={styles.label}>อีเมล</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" placeholder="เช่น name@example.com" placeholderTextColor={colors.textMuted} />
          <Text style={styles.label}>รหัสผ่าน</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="อย่างน้อย 8 ตัวอักษร" placeholderTextColor={colors.textMuted} />
          {!isLogin ? (
            <>
              <Text style={styles.label}>ยืนยันรหัสผ่าน</Text>
              <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="กรอกรหัสผ่านอีกครั้ง" placeholderTextColor={colors.textMuted} />
            </>
          ) : null}

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <TouchableOpacity style={styles.primaryButton} onPress={submit} disabled={loading}>
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryText}>{isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={changeMode} disabled={loading}>
            <Text style={styles.secondaryText}>{isLogin ? 'ยังไม่มีบัญชี? สมัครสมาชิก' : 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ'}</Text>
          </TouchableOpacity>
          {!isLogin ? <Text style={styles.note}>บัญชีที่สมัครใหม่จะเป็น user และดู/ค้นหาสินค้าได้เท่านั้น</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primaryDark },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: Platform.OS === 'web' ? 28 : 20, backgroundColor: colors.primaryDark },
  card: { width: '100%', maxWidth: 480, alignSelf: 'center', minHeight: Platform.OS === 'web' ? 620 : undefined, justifyContent: 'center', padding: Platform.OS === 'web' ? 34 : 24, borderRadius: 28, backgroundColor: colors.white, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' },
  logo: { fontSize: 48, textAlign: 'center', marginBottom: 10, alignSelf: 'center', overflow: 'hidden', backgroundColor: colors.primaryLight, borderRadius: 22, padding: 14 },
  title: { fontSize: 27, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.textGray, textAlign: 'center', marginTop: 8, marginBottom: 28 },
  label: { fontSize: 12, fontWeight: '700', color: colors.textDark, marginBottom: 6, marginTop: 10 },
  input: { height: 56, borderRadius: 15, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, color: colors.textDark, backgroundColor: colors.background },
  primaryButton: { height: 56, borderRadius: 16, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', marginTop: 28 },
  primaryText: { color: colors.white, fontSize: 15, fontWeight: '800' },
  secondaryButton: { alignItems: 'center', paddingVertical: 16 },
  secondaryText: { color: colors.accentDark, fontSize: 13, fontWeight: '700' },
  error: { color: colors.danger, fontSize: 12, lineHeight: 18, marginTop: 12 },
  note: { color: colors.textMuted, textAlign: 'center', fontSize: 11, lineHeight: 16 },
});

export default AuthScreen;
