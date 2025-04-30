import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const SignUpScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const passwordCriteria = [
    { id: 1, label: 'At least 8 characters', met: false },
    { id: 2, label: 'Contains uppercase letter', met: false },
    { id: 3, label: 'Contains number', met: false },
    { id: 4, label: 'Contains special character', met: false },
  ];

  const checkPasswordStrength = (pass) => {
    let strength = 0;
    
    // Update criteria
    passwordCriteria[0].met = pass.length >= 8;
    passwordCriteria[1].met = /[A-Z]/.test(pass);
    passwordCriteria[2].met = /[0-9]/.test(pass);
    passwordCriteria[3].met = /[^A-Za-z0-9]/.test(pass);
    
    // Calculate strength
    strength = passwordCriteria.filter(item => item.met).length;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    checkPasswordStrength(text);
  };

  const handleSignUp = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (passwordStrength < 3) {
      alert('Please create a stronger password');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate account creation process
    setTimeout(() => {
      setIsLoading(false);
    //   router.push('/dashboard');
    }, 1500);
  };

  const navigateToSignIn = () => {
    // router.push('/signin');
  };

  const navigateBack = () => {
    router.back();
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    if (passwordStrength === 4) return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return '#ccc';
    if (passwordStrength === 1) return '#ff4d4d';
    if (passwordStrength === 2) return '#ffa64d';
    if (passwordStrength === 3) return '#4dabff';
    if (passwordStrength === 4) return '#4cd964';
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
          
          <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.headerContainer}>
              <Image 
                source={require('../../assets/logo/logo.png')} 
                style={styles.logo}
              />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join FireSense for smart fire detection</Text>
            </View>
            
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={handlePasswordChange}
                />
                <TouchableOpacity 
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
              
              {password.length > 0 && (
                <View style={styles.passwordStrengthContainer}>
                  <View style={styles.strengthBarContainer}>
                    {[1, 2, 3, 4].map((index) => (
                      <View 
                        key={index}
                        style={[
                          styles.strengthBar, 
                          { 
                            backgroundColor: index <= passwordStrength 
                              ? getPasswordStrengthColor() 
                              : '#e0e0e0'
                          }
                        ]} 
                      />
                    ))}
                  </View>
                  <Text style={[
                    styles.passwordStrengthText, 
                    { color: getPasswordStrengthColor() }
                  ]}>
                    {getPasswordStrengthLabel()}
                  </Text>
                </View>
              )}
              
              {password.length > 0 && (
                <View style={styles.passwordCriteriaContainer}>
                  {passwordCriteria.map((criterion) => (
                    <View key={criterion.id} style={styles.criterionRow}>
                      <Ionicons 
                        name={criterion.met ? "checkmark-circle" : "ellipse-outline"} 
                        size={16} 
                        color={criterion.met ? "#4cd964" : "#999"} 
                      />
                      <Text style={[
                        styles.criterionText,
                        criterion.met && styles.criterionMetText
                      ]}>
                        {criterion.label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity 
                  style={styles.passwordToggle}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
              
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={styles.passwordMismatchText}>
                  Passwords do not match
                </Text>
              )}
              
              <TouchableOpacity 
                style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} 
                onPress={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.signUpButtonText}>Creating Account</Text>
                    <View style={styles.loadingDots}>
                      <View style={[styles.loadingDot, styles.loadingDot1]} />
                      <View style={[styles.loadingDot, styles.loadingDot2]} />
                      <View style={[styles.loadingDot, styles.loadingDot3]} />
                    </View>
                  </View>
                ) : (
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={navigateToSignIn}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backButton: {
    marginTop: 16,
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  passwordToggle: {
    padding: 8,
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  strengthBarContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  passwordStrengthText: {
    fontSize: 14,
    fontWeight: '500',
  },
  passwordCriteriaContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  criterionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  criterionText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
  criterionMetText: {
    color: '#666',
    fontWeight: '500',
  },
  passwordMismatchText: {
    color: '#ff4d4d',
    fontSize: 14,
    marginTop: -8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  signUpButton: {
    backgroundColor: '#0074D9',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0074D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 8,
  },
  signUpButtonDisabled: {
    backgroundColor: '#84b6e0',
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    opacity: 0.8,
  },
  loadingDot1: {
    animationName: 'bounce',
    animationDuration: '0.6s',
    animationIterationCount: 'infinite',
    animationDelay: '0s',
  },
  loadingDot2: {
    animationName: 'bounce',
    animationDuration: '0.6s',
    animationIterationCount: 'infinite',
    animationDelay: '0.2s',
  },
  loadingDot3: {
    animationName: 'bounce',
    animationDuration: '0.6s',
    animationIterationCount: 'infinite',
    animationDelay: '0.4s',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
    paddingTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  signInText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F24E1E',
  },
});

export default SignUpScreen;