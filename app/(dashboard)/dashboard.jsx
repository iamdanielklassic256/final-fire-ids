import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Bell, AlertTriangle, Shield, Phone, User, User2 } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const { theme, isDarkMode } = useTheme();
  // Animation state
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  const handleNavigation = (route, index) => {
    setActiveCardIndex(index);

    // Add a small delay before navigation for the button press animation
    setTimeout(() => {
      router.push(route);
      setActiveCardIndex(null);
    }, 150);
  };

  // Card animation styles
  const getCardStyle = (index) => {
    return {
      ...(activeCardIndex === index ? { transform: [{ scale: 0.95 }] } : {}),
      backgroundColor: theme.surface,
      shadowColor: theme.text,
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2
    };
  };

  const handleRoute = () => {
    router.push('/settings')
  }

  // Card configurations
  const cards = [
    {
      id: 'alerts',
      title: 'Alerts',
      description: 'Fire warnings and updates',
      icon: <Bell size={24} color={theme.primary} />,
      route: '/alerts',
      iconBg: theme.primaryLight,
    },
    {
      id: 'report',
      title: 'Report',
      description: 'Submit fire sightings',
      icon: <AlertTriangle size={24} color={theme.primary} />,
      route: '/report',
      iconBg: theme.primaryLight,
    },
    {
      id: 'safety',
      title: 'Safety',
      description: 'Prevention and preparation',
      icon: <Shield size={24} color={theme.primary} />,
      route: '/safety',
      iconBg: theme.primaryLight,
    },
    {
      id: 'emergency',
      title: 'Call Help',
      description: 'Emergency services',
      icon: <Phone size={24} color={theme.primary} />,
      route: '/emergency',
      iconBg: theme.primaryLight,
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.primary }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View className="px-4">
        <Text className="text-4xl font-bold text-white">Fire Sentinel</Text>
        <Text className="text-white/80 mt-1">Stay informed • Stay safe</Text>
        <TouchableOpacity
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          onPress={handleRoute}
          accessibilityLabel="User profile"
        >
          <User2 size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, backgroundColor: theme.background }} className="rounded-t-xl -mt-5">
        <ScrollView className="flex-1 p-3">
          {/* Main Feature Cards Grid */}
          <View className="flex-row flex-wrap justify-between">
            {cards.map((card, index) => (
              <Animated.View
                key={card.id}
                className="w-[48%] mb-4"
                entering={FadeInDown.delay(100 * (index + 1)).duration(500)}
              >
                <TouchableOpacity
                  style={getCardStyle(index)}
                  className="p-5 rounded-xl flex-col justify-between h-36"
                  onPress={() => handleNavigation(card.route, index)}
                  accessibilityLabel={card.title}
                >
                  <View style={{ backgroundColor: card.iconBg }} className="w-12 h-12 rounded-lg items-center justify-center">
                    {card.icon}
                  </View>
                  <View>
                    <Text style={{ color: theme.text }} className="text-lg font-bold">{card.title}</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-sm">{card.description}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Emergency Call Banner */}
          <Animated.View
            className="mt-2 mx-2 mb-4"
            entering={FadeInDown.delay(500).duration(500)}
          >
            <View style={{ backgroundColor: theme.primary }} className="p-4 rounded-xl">
              <View className="flex-row justify-between items-center">
                <Text className="text-white font-semibold text-base">Emergency? Call directly</Text>
                <TouchableOpacity
                  className="py-2 px-4 rounded-full"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  onPress={() => router.push('/call-emergency')}
                  accessibilityLabel="Call emergency number 911"
                >
                  <Text className="text-white font-bold text-base">911</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}