import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);
  
  // Safe area insets
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

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
      router.push('/dashboard');
    }, 1500);
  };

  const navigateToSignIn = () => {
    router.push('/sign-in');
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
    if (passwordStrength === 3) return '#cb4523'; // Match our brand color for "Good"
    if (passwordStrength === 4) return '#4cd964';
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1">
          <StatusBar barStyle="light-content" backgroundColor="#cb4523" />
          
          <TouchableOpacity 
            className="mt-4 ml-4 w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            onPress={navigateBack}
            style={{ marginTop: insets.top > 20 ? 0 : 16 }}
          >
            <Ionicons name="arrow-back" size={24} color="#cb4523" />
          </TouchableOpacity>
          
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View 
              className="items-center mt-2 mb-6"
              style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            >
              <Image 
                source={require('../../assets/logo/logo.png')} 
                className="w-16 h-16 mb-4 rounded-full"
              />
              <Text className="text-2xl font-bold text-gray-900 mb-2">Create Account</Text>
              <Text className="text-base text-gray-700">Join Fire Sentinel for smart fire detection</Text>
            </Animated.View>
            
            <Animated.View 
              className="px-6"
              style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            >
              <View className="flex-row items-center bg-white rounded-xl px-4 mb-4 h-14 shadow-sm border border-gray-100">
                <Ionicons name="person-outline" size={20} color="#999" className="mr-3" />
                <TextInput
                  className="flex-1 text-base text-gray-800"
                  placeholder="Full Name"
                  placeholderTextColor="#999"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              
              <View className="flex-row items-center bg-white rounded-xl px-4 mb-4 h-14 shadow-sm border border-gray-100">
                <Ionicons name="mail-outline" size={20} color="#999" className="mr-3" />
                <TextInput
                  className="flex-1 text-base text-gray-800"
                  placeholder="Email Address"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              
              <View className="flex-row items-center bg-white rounded-xl px-4 mb-3 h-14 shadow-sm border border-gray-100">
                <Ionicons name="lock-closed-outline" size={20} color="#999" className="mr-3" />
                <TextInput
                  className="flex-1 text-base text-gray-800"
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={handlePasswordChange}
                />
                <TouchableOpacity 
                  className="p-2"
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
                <View className="flex-row items-center mb-3 px-1">
                  <View className="flex-row flex-1 mr-3">
                    {[1, 2, 3, 4].map((index) => (
                      <View 
                        key={index}
                        className="flex-1 h-1 rounded mx-0.5"
                        style={{ backgroundColor: index <= passwordStrength 
                          ? getPasswordStrengthColor() : '#e0e0e0' }} 
                      />
                    ))}
                  </View>
                  <Text style={{ color: getPasswordStrengthColor() }} className="text-sm font-medium">
                    {getPasswordStrengthLabel()}
                  </Text>
                </View>
              )}
              
              {password.length > 0 && (
                <View className="mb-4 px-1">
                  {passwordCriteria.map((criterion) => (
                    <View key={criterion.id} className="flex-row items-center mb-1.5">
                      <Ionicons 
                        name={criterion.met ? "checkmark-circle" : "ellipse-outline"} 
                        size={16} 
                        color={criterion.met ? "#4cd964" : "#999"} 
                      />
                      <Text className={`text-sm ml-2 ${criterion.met ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                        {criterion.label}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              <View className="flex-row items-center bg-white rounded-xl px-4 mb-2 h-14 shadow-sm border border-gray-100">
                <Ionicons name="lock-closed-outline" size={20} color="#999" className="mr-3" />
                <TextInput
                  className="flex-1 text-base text-gray-800"
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity 
                  className="p-2"
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
                <Text className="text-red-500 text-sm mb-4 px-1">
                  Passwords do not match
                </Text>
              )}
              
              <TouchableOpacity 
                className={`bg-[#cb4523] rounded-xl h-14 items-center justify-center shadow-lg mt-2 ${isLoading ? 'opacity-80' : ''}`}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View className="flex-row items-center">
                    <Text className="text-white text-lg font-semibold">Creating Account</Text>
                    <View className="flex-row ml-2 items-center justify-center">
                      <View className="w-2 h-2 rounded-full bg-white mx-0.5 opacity-80 animate-bounce" />
                      <View className="w-2 h-2 rounded-full bg-white mx-0.5 opacity-80 animate-bounce delay-100" />
                      <View className="w-2 h-2 rounded-full bg-white mx-0.5 opacity-80 animate-bounce delay-200" />
                    </View>
                  </View>
                ) : (
                  <Text className="text-white text-lg font-semibold">Create Account</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
            
            <View className="flex-row justify-center items-center mt-auto mb-6">
              <Text className="text-sm text-gray-600 mr-1">Already have an account?</Text>
              <TouchableOpacity onPress={navigateToSignIn}>
                <Text className="text-sm font-semibold text-[#cb4523]">Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;