import { View, Text, Image, SafeAreaView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import logo from '../assets/logo/logo.png';
import { router } from 'expo-router';
import { slides } from '../data/slides';

const { width } = Dimensions.get('window');



const WelcomeScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Animated.spring(scrollX, {
      toValue: -currentIndex * width,
      useNativeDriver: true,
      speed: 1,
      bounciness: 0,
    }).start();
  }, [currentIndex]);

  const handleRoute = () => {
    router.push('/auth/sign-in')
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="absolute top-[-200] right-[-100] w-[400px] h-[400px] rounded-full bg-[#f27c22] bg-opacity-10" />
      
      <View className="flex-1 p-6 justify-between">
        {/* Logo */}
        <View className="items-center mt-16">
          <Image
            source={logo}
            className="w-64 h-80"
            resizeMode="contain"
          />
        </View>

        {/* Slider */}
        <View className="h-48 overflow-hidden">
          <Animated.View className="flex-row" style={{
            width: width * slides.length,
            transform: [{ translateX: scrollX }]
          }}>
            {slides.map((slide, index) => (
              <View key={index} className="px-6 items-center" style={{ width }}>
                <Text className="text-3xl font-bold text-gray-900 text-center mb-3">{slide.title}</Text>
                <Text className="text-base text-gray-600 text-center leading-6">{slide.description}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Dots Indicator */}
          <View className="flex-row justify-center items-center mt-5">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`rounded mx-1 ${
                  currentIndex === index 
                    ? "bg-[#f27c22] w-6 h-2" 
                    : "bg-gray-300 w-2 h-2"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity 
          className="bg-[#f27c22] py-4 rounded-2xl mt-10 mb-10 shadow-lg"
          style={{
            shadowColor: '#f27c22',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={handleRoute}
        >
          <Text className="text-white text-center text-lg font-semibold">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;