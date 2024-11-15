import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from "expo-status-bar";
import { Loader } from "../components";
import Constants from 'expo-constants';
import { router } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import logo from '../assets/icons/logo/logoname.png';
import AppVersion from '../components/AppVersion';

const Welcome = () => {
  const [isLoading, setIsLoading] = useState(false);
  const appVersion = Constants.expoConfig?.version || "1.0.0";
  const { width } = Dimensions.get('window');

  // Animation values
  const logoScale = new Animated.Value(0);
  const titleOpacity = new Animated.Value(0);
  const buttonsTranslateY = new Animated.Value(50);
  const buttonsFade = new Animated.Value(0);

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(buttonsTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  setTimeout(() => {
    setIsLoading(false);
  }, 3000);

  const renderButton = (text, icon, onPress, bgColor, textColor) => (
    <TouchableOpacity
      onPress={onPress}
      className={`p-4 rounded-xl flex-row items-center justify-center shadow-lg`}
      style={{ backgroundColor: bgColor }}
    >
      <MaterialIcons name={icon} size={24} color={textColor} style={{ marginRight: 8 }} />
      <Text className={`text-lg font-bold`} style={{ color: textColor }}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      <Loader isLoading={isLoading} />

      <LinearGradient
        colors={['#028758', '#016d46', '#004d32']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 px-6 py-8"
      >
        <View className="flex-1 justify-between">
          {/* Logo and Title Section */}
          <View className="items-center mt-[8%]">
            <Animated.View style={{ transform: [{ scale: logoScale }] }}>
              <Image
                source={logo}
                className="w-[120px] h-[120px] rounded-3xl"
                resizeMode="contain"
              />
            </Animated.View>
            
            <Animated.View style={{ opacity: titleOpacity }} className="mt-6">
              <Text className="text-white text-4xl font-bold text-center">
                Welcome to Akiba
              </Text>
              <Text className="text-[#E0E0E0] text-lg text-center mt-3 px-4">
                Your trusted partner in financial growth and success
              </Text>
            </Animated.View>
          </View>

          {/* Buttons Section */}
          <Animated.View 
            style={{
              transform: [{ translateY: buttonsTranslateY }],
              opacity: buttonsFade,
            }}
            className="space-y-4 w-full mt-8"
          >
            {renderButton(
              "Personal Login",
              "person",
              () => router.push("/sign-in"),
              "#250048",
              "#ffffff"
            )}
            
            {renderButton(
              "Group Login",
              "group",
              () => router.push("/group-login"),
              "#250048",
              "#ffffff"
            )}
            
            {renderButton(
              "Create an Account",
              "add-circle-outline",
              () => router.push("/sign-up"),
              "#250048",
              "#ffffff"
            )}
          </Animated.View>
          <Animated.View 
            style={{ opacity: buttonsFade }}
            className="mt-8"
          >
            <Text className="text-[#E0E0E0] text-center text-base font-medium mb-2">
              Start your journey to financial independence today!
            </Text>
            <AppVersion />
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Welcome;