import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Shield, ChevronDown, ChevronRight, Info, CheckCircle, Home, Layers, Wind } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

export default function SafetyScreen() {
  const { theme, isDarkMode } = useTheme();
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (index) => {
    if (expandedSection === index) {
      setExpandedSection(null);
    } else {
      setExpandedSection(index);
    }
  };

  const safetyTips = [
    {
      title: "Fire Prevention at Home",
      icon: <Home size={22} color={theme.primary} />,
      content: [
        "Install smoke detectors on every floor and in bedrooms",
        "Test smoke alarms monthly and replace batteries annually",
        "Keep fire extinguishers in easily accessible locations",
        "Never leave cooking unattended in the kitchen",
        "Keep flammable items away from heat sources"
      ]
    },
    {
      title: "Emergency Preparedness",
      icon: <Shield size={22} color={theme.primary} />,
      content: [
        "Create and practice a fire escape plan with your family",
        "Identify two ways to exit each room",
        "Establish a family meeting point outside",
        "Keep emergency contacts readily available",
        "Store important documents in a fireproof safe",
        "Have working flashlights and batteries on hand"
      ]
    },
    {
      title: "Fire Safety Maintenance",
      icon: <Layers size={22} color={theme.primary} />,
      content: [
        "Regular inspection of electrical cords and outlets",
        "Clean dryer vents and lint traps regularly",
        "Have heating systems serviced annually",
        "Keep chimneys and fireplaces clean",
        "Maintain proper spacing for portable heaters",
        "Check fire extinguisher pressure gauges monthly"
      ]
    },
    {
      title: "During a Fire Emergency",
      icon: <Wind size={22} color={theme.primary} />,
      content: [
        "Get out immediately when you hear a fire alarm",
        "Crawl low under smoke to escape",
        "Feel doors for heat before opening them",
        "Never use elevators during a fire",
        "Once out, stay out - never go back inside",
        "Call emergency services from a safe location"
      ]
    }
  ];

  const quickChecklist = [
    "Test smoke detectors monthly",
    "Keep fire extinguishers accessible",
    "Clear escape routes of obstacles",
    "Post emergency numbers visibly",
    "Practice family escape plan"
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.primary }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {/* Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          className="w-10 h-10 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Safety Tips</Text>
        <View className="w-10" />
      </View>

      <View style={{ flex: 1, backgroundColor: theme.background }} className="rounded-t-xl">
        <ScrollView className="flex-1">
          {/* Header Banner */}
          <Animated.View entering={FadeIn.duration(500)}>
            <View style={{ backgroundColor: theme.primary }} className="p-5">
              <View className="flex-row items-center mb-2">
                <Shield size={24} color="white" />
                <Text className="text-xl font-bold text-white ml-2">Fire Safety & Prevention</Text>
              </View>
              <Text className="text-white/90">
                Learn how to protect your home and family from fires with these essential safety tips.
              </Text>
            </View>
          </Animated.View>

          {/* Info Banner */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <View style={{ backgroundColor: theme.primaryLight }} className="mx-4 mt-4 p-4 rounded-xl flex-row items-start">
              <Info size={22} color={theme.primary} />
              <Text style={{ color: theme.primary }} className="ml-2 flex-1">
                Fire safety starts with prevention. Learn these essential tips to protect your home and loved ones from fire hazards.
              </Text>
            </View>
          </Animated.View>

          {/* Quick Checklist */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <View style={{ backgroundColor: theme.primaryLight }} className="mx-4 mt-4 p-4 rounded-xl">
              <Text style={{ color: theme.text }} className="font-bold text-lg mb-2">Quick Safety Checklist</Text>
              {quickChecklist.map((item, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <CheckCircle size={18} color={theme.primary} />
                  <Text style={{ color: theme.text }} className="ml-2">{item}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Safety Tips Accordion */}
          <View className="px-4 py-4">
            <Text style={{ color: theme.text }} className="font-bold text-xl mb-3">Detailed Safety Guidelines</Text>

            {safetyTips.map((section, index) => (
              <Animated.View
                key={index}
                className="mb-3"
                entering={FadeInDown.delay(300 + (index * 100)).duration(500)}
              >
                <TouchableOpacity
                  style={{ 
                    backgroundColor: expandedSection === index ? theme.primaryLight : theme.surface,
                    borderColor: theme.border
                  }}
                  className="flex-row items-center justify-between p-4 rounded-xl border"
                  onPress={() => toggleSection(index)}
                >
                  <View className="flex-row items-center">
                    <View style={{ backgroundColor: theme.primaryLight }} className="w-8 h-8 rounded-full items-center justify-center">
                      {section.icon}
                    </View>
                    <Text style={{ color: theme.text }} className="font-semibold ml-3">{section.title}</Text>
                  </View>
                  {expandedSection === index ? (
                    <ChevronDown size={20} color={theme.primary} />
                  ) : (
                    <ChevronRight size={20} color={theme.primary} />
                  )}
                </TouchableOpacity>

                {expandedSection === index && (
                  <View style={{ backgroundColor: theme.surface, borderColor: theme.border }} className="p-4 rounded-b-xl border-x border-b">
                    {section.content.map((tip, i) => (
                      <View key={i} className="flex-row items-start mb-2">
                        <View style={{ backgroundColor: theme.primary }} className="w-2 h-2 rounded-full mt-2" />
                        <Text style={{ color: theme.textSecondary }} className="ml-2 flex-1">{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Animated.View>
            ))}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}