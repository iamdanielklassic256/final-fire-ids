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
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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

  const handleSignIn = () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1500);
  };


  const navigateToSignUp = () => {
    router.push('/sign-up');
  };

  const navigateBack = () => {
    router.back();
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
          
          <Animated.View 
            className="items-center mt-5 mb-10"
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          >
            <Image 
              source={require('../../assets/logo/logo.png')} 
              className="w-16 h-16 mb-4 rounded-full"
            />
            <Text className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</Text>
            <Text className="text-base text-gray-700">Sign in to continue to Fire Sentinel</Text>
          </Animated.View>
          
          <Animated.View 
            className="px-6"
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          >
            <View className="flex-row items-center bg-white rounded-xl px-4 mb-4 h-14 shadow-sm border border-gray-100">
              <Ionicons name="mail-outline" size={20} color="#999" className="mr-3" />
              <TextInput
                className="flex-1 text-base text-gray-800"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            
            <View className="flex-row items-center bg-white rounded-xl px-4 mb-4 h-14 shadow-sm border border-gray-100">
              <Ionicons name="lock-closed-outline" size={20} color="#999" className="mr-3" />
              <TextInput
                className="flex-1 text-base text-gray-800"
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
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
            
            
            
            <TouchableOpacity 
              className={`bg-[#cb4523] rounded-xl h-14 items-center justify-center shadow-lg ${isLoading ? 'opacity-80' : ''}`}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <Text className="text-white text-lg font-semibold">Signing In</Text>
                  <View className="flex-row ml-2 items-center justify-center">
                    <View className="w-2 h-2 rounded-full bg-white mx-0.5 opacity-80 animate-bounce" />
                    <View className="w-2 h-2 rounded-full bg-white mx-0.5 opacity-80 animate-bounce delay-100" />
                    <View className="w-2 h-2 rounded-full bg-white mx-0.5 opacity-80 animate-bounce delay-200" />
                  </View>
                </View>
              ) : (
                <Text className="text-white text-lg font-semibold">Sign In</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
          
          <View className="flex-row justify-center items-center mt-auto mb-6">
            <Text className="text-sm text-gray-600 mr-1">Don't have an account?</Text>
            <TouchableOpacity onPress={navigateToSignUp}>
              <Text className="text-sm font-semibold text-[#cb4523]">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;