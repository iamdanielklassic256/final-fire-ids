import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Alert, 
  StatusBar,
  ActivityIndicator,
  Dimensions,
  StyleSheet 
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { send_phone_verification_url } from '../api/api';

const { width } = Dimensions.get('window');

const VerifyPhone = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [member, setMember] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const memberData = await AsyncStorage.getItem("member");
        if (memberData) {
          const parsedMember = JSON.parse(memberData);
          setMember(parsedMember);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
        setError("Failed to fetch member data. Please try again.");
      }
    };

    fetchMemberData();
    setTimeout(() => setAnimationComplete(true), 800);
  }, []);

  const myPhoneNumber = member?.contact_one;

  const formatPhoneNumber = (number) => {
    let cleaned = number.replace(/\D/g, '');
    if (!cleaned.startsWith('256')) {
      if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
      }
      cleaned = '256' + cleaned;
    }
    return '+' + cleaned;
  };

  const displayPhoneNumber = (number) => {
    if (!number) return '';
    const formatted = formatPhoneNumber(number);
    return formatted.replace(/(\+\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(myPhoneNumber);
      const response = await fetch(send_phone_verification_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      await AsyncStorage.setItem('phoneNumber', formattedPhone);
      router.push('/verify-otp');
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Failed to send verification code. Please try again.'
      );
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
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
          <Text style={styles.headerTitle}>Verify Phone Number</Text>
        </MotiView>
      </LinearGradient>

      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', delay: 200 }}
        style={styles.content}
		className=""
      >
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="phone-portrait-outline" size={32} color="#028758" />
          </View>
          
          <Text style={styles.title}>Confirm Your Number</Text>
          <Text style={styles.subtitle}>
            We'll send a verification code to your phone number
          </Text>

          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>Your Phone Number</Text>
            <View style={styles.phoneNumberBox}>
              <Text style={styles.phoneNumber}>
                {displayPhoneNumber(myPhoneNumber)}
              </Text>
              {animationComplete && (
                <MotiView
                  from={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#028758" />
                </MotiView>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerify}
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
                <Text style={styles.buttonText}>Send Verification Code</Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </MotiView>
            )}
          </TouchableOpacity>
        </View>

        {error && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring' }}
            style={styles.errorContainer}
          >
            <Text style={styles.errorText}>{error}</Text>
          </MotiView>
        )}
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
  phoneContainer: {
    marginBottom: 24,
  },
  phoneLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  phoneNumberBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: 1,
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
  errorContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef5350',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
});

export default VerifyPhone;