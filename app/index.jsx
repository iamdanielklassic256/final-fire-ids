import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import logo from '../assets/logo/logo.png';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: "Welcome to Pro Church",
    description: "Your complete church management solution in one place"
  },
  {
    title: "Streamline Ministry",
    description: "Efficiently manage members, events, and resources"
  },
  {
    title: "Grow Together",
    description: "Build stronger connections in your church community"
  }
];

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundCircle} />
      
      <View style={styles.contentContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Slider */}
        <View style={styles.sliderContainer}>
          <Animated.View style={[
            styles.slidesWrapper,
            {
              transform: [{ translateX: scrollX }]
            }
          ]}>
            {slides.map((slide, index) => (
              <View key={index} style={styles.slide}>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideDescription}>{slide.description}</Text>
              </View>
            ))}
          </Animated.View>

          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index && styles.activeDot
                ]}
              />
            ))}
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundCircle: {
    position: 'absolute',
    top: -200,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#4C51BF15',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 150,
    height: 150,
  },
  sliderContainer: {
    height: 200,
    overflow: 'hidden',
  },
  slidesWrapper: {
    flexDirection: 'row',
    width: width * slides.length,
  },
  slide: {
    width: width,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 12,
  },
  slideDescription: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4C51BF',
    width: 24,
  },
  button: {
    backgroundColor: '#4C51BF',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 40,
    marginBottom: 40,
    shadowColor: '#4C51BF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomeScreen;