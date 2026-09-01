import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { api } from '../services/api';
import { colors } from '../styles/colors';

const AuthScreen = ({ onAuthenticated }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async () => {
    if (!username.trim() || !password) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }
    if (!isLogin && !/^[A-Za-z0-9_.-]{3,50}$/.test(username.trim())) {
      setErrorMessage('ชื่อผู้ใช้ใช้ได้เฉพาะภาษาอังกฤษ ตัวเลข จุด ขีดกลาง และขีดล่าง (3–50 ตัวอักษร)');
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
        ? await api.login(username.trim(), password)
        : await api.register(username.trim(), password);
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
      <View style={styles.card}>
        <Text style={styles.logo}>🏸</Text>
        <Text style={styles.title}>ร้านไม้แบด</Text>
        <Text style={styles.subtitle}>{isLogin ? 'เข้าสู่ระบบเพื่อดูสินค้า' : 'สมัครสมาชิกเพื่อเริ่มใช้งาน'}</Text>

        <Text style={styles.label}>ชื่อผู้ใช้</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false} placeholder="เช่น tanawin" placeholderTextColor={colors.textMuted} />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  card: { padding: 24, borderRadius: 24, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  logo: { fontSize: 50, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.textGray, textAlign: 'center', marginTop: 6, marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '700', color: colors.textDark, marginBottom: 6, marginTop: 10 },
  input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, color: colors.textDark, backgroundColor: colors.background },
  primaryButton: { height: 50, borderRadius: 14, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  primaryText: { color: colors.white, fontSize: 15, fontWeight: '800' },
  secondaryButton: { alignItems: 'center', paddingVertical: 16 },
  secondaryText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  error: { color: colors.danger, fontSize: 12, lineHeight: 18, marginTop: 12 },
  note: { color: colors.textMuted, textAlign: 'center', fontSize: 11, lineHeight: 16 },
});

export default AuthScreen;
