import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  StyleSheet,
  StatusBar
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { verify_phone_url } from '../api/api';

const VerifyOTP = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const getStoredPhone = async () => {
      try {
        const storedPhone = await AsyncStorage.getItem('phoneNumber');
        if (storedPhone) {
          setPhoneNumber(storedPhone);
        }
      } catch (error) {
        console.error('Error fetching phone number:', error);
      }
    };
    
    getStoredPhone();
  }, []);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid Code', 'Please enter a valid verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${verify_phone_url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          otp
        })
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const memberData = await AsyncStorage.getItem('member');
      if (memberData) {
        const member = JSON.parse(memberData);
        member.is_phone_verified = true;
        await AsyncStorage.setItem('member', JSON.stringify(member));
      }

      Alert.alert(
        'Success',
        'Phone number verified successfully',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
      router.push('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to verify code. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(verify_phone_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber
        })
      });

      if (!response.ok) {
        throw new Error('Failed to resend code');
      }

      Alert.alert('Success', 'New verification code sent');
    } catch (error) {
      Alert.alert('Error', 'Failed to send new code. Please try again.');
      console.error(error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#028758', '#025c3b']}
        style={styles.header}
      >
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.headerContent}
        >
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enter Verification Code</Text>
        </MotiView>
      </LinearGradient>

      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', delay: 200 }}
        style={styles.content}
      >
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="phone-portrait-outline" size={32} color="#028758" />
          </View>
          
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            We sent a code to {phoneNumber}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter verification code"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <MotiView
                from={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                style={styles.buttonContent}
              >
                <Text style={styles.buttonText}>Verify Code</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </MotiView>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={resendLoading}
          >
            {resendLoading ? (
              <ActivityIndicator color="#028758" />
            ) : (
              <Text style={styles.resendText}>
                Didn't receive code? Send again
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 140,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerContent: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginTop: 12,
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(2, 135, 88, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    height: 56,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#028758',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#028758',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  resendButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  resendText: {
    color: '#028758',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default VerifyOTP;