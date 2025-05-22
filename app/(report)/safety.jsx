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
import { ArrowLeft, Shield, ChevronDown, ChevronRight, Info, CheckCircle, Trees, Flame, Wind, MapPin } from 'lucide-react-native';
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
      title: "Forest Fire Prevention",
      icon: <Trees size={22} color={theme.primary} />,
      content: [
        "Always extinguish campfires completely with water and stir ashes",
        "Never leave a fire unattended, even for a short time",
        "Clear a 10-foot area around campfires of flammable materials",
        "Check fire restrictions and weather conditions before starting fires",
        "Use established fire rings or metal fire pans when available",
        "Keep water and a shovel nearby when using fire in the forest"
      ]
    },
    {
      title: "Forest Emergency Preparedness",
      icon: <Shield size={22} color={theme.primary} />,
      content: [
        "Know multiple escape routes from your forest location",
        "Carry emergency communication devices (satellite phone, GPS beacon)",
        "Inform others of your forest visit plans and expected return",
        "Pack emergency supplies including water, first aid, and shelter",
        "Download offline maps and know your exact location coordinates",
        "Keep vehicles fueled and parked facing exit routes"
      ]
    },
    {
      title: "Forest Equipment & Maintenance",
      icon: <Wind size={22} color={theme.primary} />,
      content: [
        "Maintain spark arresters on all motorized equipment",
        "Check exhaust systems for leaks and proper function",
        "Keep fire extinguishers in vehicles and equipment",
        "Use only approved containers for fuel storage",
        "Perform equipment maintenance away from dry vegetation",
        "Install and maintain fire suppression systems in forest buildings"
      ]
    },
    {
      title: "During a Forest Fire Emergency",
      icon: <Flame size={22} color={theme.primary} />,
      content: [
        "Evacuate immediately when advised by forest authorities",
        "Follow established evacuation routes and forest service directions",
        "If trapped, move to a clearing away from vegetation",
        "Cover exposed skin and breathe through cloth to filter smoke",
        "Never attempt to outrun a fire uphill or through heavy vegetation",
        "Signal for help using mirrors, bright clothing, or emergency beacons"
      ]
    },
    {
      title: "Wildlife & Forest Interaction",
      icon: <MapPin size={22} color={theme.primary} />,
      content: [
        "Maintain safe distances from all wildlife during emergencies",
        "Store food properly to avoid attracting animals to campsites",
        "Report injured or distressed wildlife to forest authorities",
        "Avoid using strong scents that may attract wildlife",
        "Create noise when moving through dense forest areas",
        "Never feed wildlife or leave food scraps in the forest"
      ]
    }
  ];

  const quickChecklist = [
    "Check fire danger ratings before forest visits",
    "Carry emergency communication devices",
    "Know your evacuation routes",
    "Maintain proper fire extinguishing tools",
    "Follow all forest fire restrictions",
    "Report smoke or fires immediately"
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
        <Text className="text-2xl font-bold text-white">Forest Safety</Text>
        <View className="w-10" />
      </View>

      <View style={{ flex: 1, backgroundColor: theme.background }} className="rounded-t-xl">
        <ScrollView className="flex-1">
          {/* Header Banner */}
          <Animated.View entering={FadeIn.duration(500)}>
            <View style={{ backgroundColor: theme.primary }} className="p-5">
              <View className="flex-row items-center mb-2">
                <Trees size={24} color="white" />
                <Text className="text-xl font-bold text-white ml-2">Forest Fire Safety & Prevention</Text>
              </View>
              <Text className="text-white/90">
                Essential safety guidelines for preventing and responding to forest fires while protecting our natural reserves.
              </Text>
            </View>
          </Animated.View>

          {/* Info Banner */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <View style={{ backgroundColor: theme.primaryLight }} className="mx-4 mt-4 p-4 rounded-xl flex-row items-start">
              <Info size={22} color={theme.primary} />
              <Text style={{ color: theme.primary }} className="ml-2 flex-1">
                Forest fire safety requires vigilance and preparation. Learn these essential practices to protect our forests and ensure your safety in wilderness areas.
              </Text>
            </View>
          </Animated.View>

          {/* Quick Checklist */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <View style={{ backgroundColor: theme.primaryLight }} className="mx-4 mt-4 p-4 rounded-xl">
              <Text style={{ color: theme.text }} className="font-bold text-lg mb-2">Forest Safety Checklist</Text>
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
            <Text style={{ color: theme.text }} className="font-bold text-xl mb-3">Detailed Forest Safety Guidelines</Text>

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

          {/* Emergency Contacts */}
          <Animated.View entering={FadeInDown.delay(800).duration(500)}>
            <View style={{ backgroundColor: '#ef4444' }} className="mx-4 mb-4 p-4 rounded-xl">
              <Text className="text-white font-bold text-lg mb-2">Emergency Contacts</Text>
              <Text className="text-white/90 mb-1">Forest Fire Emergency: 911</Text>
              <Text className="text-white/90 mb-1">Forest Service: 1-800-FOREST</Text>
              <Text className="text-white/90">Local Rangers: Contact your regional forest office</Text>
            </View>
          </Animated.View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}