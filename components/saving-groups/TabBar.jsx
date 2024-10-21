import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const tabData = [
  { key: 'financial', icon: 'cash-multiple', color: '#4CAF50' },
  { key: 'social', icon: 'account-group', color: '#2196F3' },
  { key: 'penalties', icon: 'gavel', color: '#FF9800' },
  { key: 'members', icon: 'account-multiple', color: '#9C27B0' },
  { key: 'durations', icon: 'clock-outline', color: '#00BCD4' },
  { key: 'requests', icon: 'inbox-arrow-down', color: '#F44336' },
  { key: 'loans', icon: 'cash', color: '#c38b06' },
];

const TabBar = ({ activeTab, onTabPress }) => {
  const [measures, setMeasures] = useState([]);
  const [measuresLoaded, setMeasuresLoaded] = useState(false);
  const scrollViewRef = useRef();
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (measuresLoaded) {
      const activeIndex = tabData.findIndex(tab => tab.key === activeTab);
      if (activeIndex !== -1 && measures[activeIndex]) {
        onTabPressHandler(activeIndex);
      }
    }
  }, [measuresLoaded, activeTab]);

  const measureTab = (event, index) => {
    const { x, width } = event.nativeEvent.layout;
    const newMeasures = [...measures];
    newMeasures[index] = { x, width };
    setMeasures(newMeasures);
    if (index === tabData.length - 1) {
      setMeasuresLoaded(true);
    }
  };

  const onTabPressHandler = (index) => {
    onTabPress(tabData[index].key);
    if (measures[index]) {
      const { x, width } = measures[index];
      Animated.spring(indicatorAnim, {
        toValue: x,
        useNativeDriver: true,
      }).start();

      scrollViewRef.current.scrollTo({ x: x - (width * 1.5), animated: true });
    }
  };

  return (
    <View style={{ height: 60, marginBottom: 10 }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {tabData.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            onLayout={(event) => measureTab(event, index)}
            onPress={() => onTabPressHandler(index)}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 20,
              marginRight: 10,
              backgroundColor: activeTab === tab.key ? tab.color : 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={24}
              color={activeTab === tab.key ? 'white' : tab.color}
            />
            <Text
              style={{
                marginLeft: 8,
                color: activeTab === tab.key ? 'white' : 'black',
                fontWeight: 'bold',
              }}
            >
              {tab.key.charAt(0).toUpperCase() + tab.key.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
        <Animated.View
          style={{
            position: 'absolute',
            height: 3,
            width: 40,
            backgroundColor: 'blue',
            bottom: 0,
            transform: [{ translateX: indicatorAnim }],
          }}
        />
      </ScrollView>
    </View>
  );
};

export default TabBar;