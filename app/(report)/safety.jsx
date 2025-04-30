import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Shield, ChevronDown, ChevronRight, Info, CheckCircle, Home, Layers, Wind } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function SafetyScreen() {
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
      title: "Create a Defensible Space",
      icon: <Home size={22} color="#2563eb" />,
      content: [
        "Clear dead vegetation within 30 feet of your home",
        "Remove flammable materials from around structures",
        "Prune tree branches that extend over your roof",
        "Move firewood stacks at least 30 feet from structures",
        "Keep grass short and well-watered around your property"
      ]
    },
    {
      title: "Prepare an Emergency Kit",
      icon: <Shield size={22} color="#2563eb" />,
      content: [
        "Pack essential medications and first aid supplies",
        "Include important documents in waterproof container",
        "Store at least 3 days worth of non-perishable food",
        "Pack 1 gallon of water per person per day",
        "Include flashlights, batteries, and portable radio",
        "Have N95 masks available for smoke protection"
      ]
    },
    {
      title: "Create an Evacuation Plan",
      icon: <Layers size={22} color="#2563eb" />,
      content: [
        "Identify multiple evacuation routes from your neighborhood",
        "Designate meeting locations for family members",
        "Practice evacuation drills regularly with your household",
        "Prepare a list of emergency contacts",
        "Plan for accommodations for pets and livestock",
        "Sign up for local emergency alerts and notifications"
      ]
    },
    {
      title: "During High Fire Danger",
      icon: <Wind size={22} color="#2563eb" />,
      content: [
        "Avoid activities that could create sparks outdoors",
        "Never leave barbecues or campfires unattended",
        "Dispose of cigarettes properly in designated containers",
        "Avoid operating equipment that could create sparks",
        "Keep vehicles off dry grass to prevent ignition from hot exhaust",
        "Report any smoke or fire sightings immediately to 911"
      ]
    }
  ];

  const quickChecklist = [
    "Clear gutters of debris and leaves",
    "Install spark arrestors on chimneys",
    "Keep garden hoses accessible and ready",
    "Move flammable patio furniture when not in use",
    "Have fire extinguishers checked and ready"
  ];

  return (
    <SafeAreaView className="flex-1 bg-blue-600">
      {/* Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-2">
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Safety Tips</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 bg-gray-50 rounded-t-xl">
        <ScrollView className="flex-1">
          {/* Header Banner */}
          <Animated.View entering={FadeIn.duration(500)}>
            <View className="bg-blue-500 p-5">
              <View className="flex-row items-center mb-2">
                <Shield size={24} color="white" />
                <Text className="text-xl font-bold text-white ml-2">Fire Safety & Prevention</Text>
              </View>
              <Text className="text-white/90">
                Learn how to protect your home and family from wildfires with these essential safety tips.
              </Text>
            </View>
          </Animated.View>

          {/* Info Banner */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <View className="mx-4 mt-4 bg-blue-50 p-4 rounded-xl flex-row items-start">
              <Info size={22} color="#2563eb" />
              <Text className="text-blue-800 ml-2 flex-1">
                Being prepared for wildfires can save lives and property. Review these safety tips regularly and share them with your family.
              </Text>
            </View>
          </Animated.View>

          {/* Quick Checklist */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <View className="mx-4 mt-4 bg-green-50 p-4 rounded-xl">
              <Text className="font-bold text-gray-800 text-lg mb-2">Quick Safety Checklist</Text>
              {quickChecklist.map((item, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <CheckCircle size={18} color="#16a34a" />
                  <Text className="text-gray-700 ml-2">{item}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Safety Tips Accordion */}
          <View className="px-4 py-4">
            <Text className="font-bold text-gray-800 text-xl mb-3">Detailed Safety Guidelines</Text>
            
            {safetyTips.map((section, index) => (
              <Animated.View 
                key={index}
                className="mb-3"
                entering={FadeInDown.delay(300 + (index * 100)).duration(500)}
              >
                <TouchableOpacity
                  className={`flex-row items-center justify-between p-4 rounded-xl ${
                    expandedSection === index ? 'bg-blue-100' : 'bg-white'
                  } border border-gray-200`}
                  onPress={() => toggleSection(index)}
                >
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                      {section.icon}
                    </View>
                    <Text className="font-semibold text-gray-800 ml-3">{section.title}</Text>
                  </View>
                  {expandedSection === index ? (
                    <ChevronDown size={20} color="#2563eb" />
                  ) : (
                    <ChevronRight size={20} color="#2563eb" />
                  )}
                </TouchableOpacity>

                {expandedSection === index && (
                  <View className="bg-white p-4 rounded-b-xl border-x border-b border-gray-200">
                    {section.content.map((tip, i) => (
                      <View key={i} className="flex-row items-start mb-2">
                        <View className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                        <Text className="text-gray-700 ml-2 flex-1">{tip}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Animated.View>
            ))}
          </View>

          {/* Emergency Reminder */}
          <Animated.View entering={FadeInDown.delay(700).duration(500)}>
            <View className="mx-4 mb-8 bg-red-50 p-4 rounded-xl">
              <Text className="font-bold text-gray-800 text-lg mb-1">Remember</Text>
              <Text className="text-gray-700">
                In case of immediate danger, evacuate first and call emergency services at <Text className="font-bold text-red-600">911</Text>. 
                Don't wait until it's too late.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}