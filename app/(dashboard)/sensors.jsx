import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertTriangle, Battery, Bell, Check, ChevronLeft, Droplet, Map, Phone, RefreshCw, Shield, Sun, Thermometer, User, Wind } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SensorScreen = () => {
  const insets = useSafeAreaInsets();
  const [sensors, setSensors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Sample sensor data
  const sampleSensors = [
    {
      id: 's1',
      name: 'Temperature Sensor',
      location: 'Living Room',
      type: 'temperature',
      value: 72,
      unit: '°F',
      status: 'normal',
      battery: 85,
      lastUpdate: '2 minutes ago',
    },
    {
      id: 's2',
      name: 'Humidity Sensor',
      location: 'Kitchen',
      type: 'humidity',
      value: 45,
      unit: '%',
      status: 'normal',
      battery: 92,
      lastUpdate: '5 minutes ago',
    },
    {
      id: 's3',
      name: 'Smoke Detector',
      location: 'Hallway',
      type: 'smoke',
      value: 'Clear',
      unit: '',
      status: 'normal',
      battery: 76,
      lastUpdate: '7 minutes ago',
    },
    {
      id: 's4',
      name: 'Heat Sensor',
      location: 'Garage',
      type: 'temperature',
      value: 80,
      unit: '°F',
      status: 'warning',
      battery: 65,
      lastUpdate: '10 minutes ago',
    },
    {
      id: 's5',
      name: 'Carbon Monoxide',
      location: 'Basement',
      type: 'co',
      value: '0',
      unit: 'ppm',
      status: 'normal',
      battery: 90,
      lastUpdate: '15 minutes ago',
    },
    {
      id: 's6',
      name: 'Air Quality',
      location: 'Bedroom',
      type: 'aqi',
      value: '43',
      unit: 'AQI',
      status: 'normal',
      battery: 72,
      lastUpdate: '20 minutes ago',
    },
  ];

  useEffect(() => {
    // Simulate loading data from an API
    setTimeout(() => {
      setSensors(sampleSensors);
      setIsLoading(false);
    }, 1000);
  }, []);

  const refreshSensors = () => {
    setRefreshing(true);
    
    // Simulate refresh with randomized sensor values
    setTimeout(() => {
      const updatedSensors = sampleSensors.map(sensor => {
        if (sensor.type === 'temperature') {
          const newValue = Math.floor(Number(sensor.value) + (Math.random() * 6 - 3));
          const newStatus = newValue > 85 ? 'warning' : 'normal';
          return {...sensor, value: newValue, status: newStatus, lastUpdate: 'Just now'};
        } else if (sensor.type === 'humidity') {
          const newValue = Math.floor(Number(sensor.value) + (Math.random() * 10 - 5));
          return {...sensor, value: Math.max(0, Math.min(100, newValue)), lastUpdate: 'Just now'};
        } else {
          return {...sensor, lastUpdate: 'Just now'};
        }
      });
      
      setSensors(updatedSensors);
      setRefreshing(false);
    }, 1500);
  };

  // Get color based on sensor status
  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'danger':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  // Get icon based on sensor type
  const getSensorIcon = (type) => {
    switch (type) {
      case 'temperature':
        return <Thermometer width={24} height={24} color="#F44336" />;
      case 'humidity':
        return <Droplet width={24} height={24} color="#2196F3" />;
      case 'smoke':
        return <AlertTriangle width={24} height={24} color="#FF9800" />;
      case 'co':
        return <AlertTriangle width={24} height={24} color="#9C27B0" />;
      case 'aqi':
        return <Wind width={24} height={24} color="#4CAF50" />;
      default:
        return <Check width={24} height={24} color="#9E9E9E" />;
    }
  };

  // Get background color based on sensor type
  const getIconBgColor = (type, status) => {
    switch (type) {
      case 'temperature':
        return 'bg-red-100';
      case 'humidity':
        return 'bg-blue-100';
      case 'smoke':
        return 'bg-yellow-100';
      case 'co':
        return 'bg-purple-100';
      case 'aqi':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };

  // Battery indicator component
  const BatteryIndicator = ({ level }) => {
    let bgColor = 'bg-green-500';
    if (level < 30) bgColor = 'bg-red-500';
    else if (level < 60) bgColor = 'bg-yellow-500';
    
    return (
      <View className="flex-row items-center">
        <Battery width={14} height={14} color="#666" />
        <View className="w-10 h-2 bg-gray-200 rounded-full mx-1 overflow-hidden">
          <View 
            className={`h-full rounded-full ${bgColor}`} 
            style={{ width: `${level}%` }} 
          />
        </View>
        <Text className="text-xs text-gray-500">{level}%</Text>
      </View>
    );
  };

  // Render individual sensor card
  const renderSensorCard = (sensor) => {
    return (
      <TouchableOpacity 
        key={sensor.id}
        className="bg-white rounded-xl p-4 mb-3 shadow-sm"
        activeOpacity={0.8}
        accessibilityLabel={`${sensor.name} in ${sensor.location}, value: ${sensor.value}${sensor.unit}, status: ${sensor.status}`}
        accessibilityRole="button"
      >
        <View className="flex-row items-center mb-3">
          <View className={`w-12 h-12 rounded-lg items-center justify-center mr-3 ${getIconBgColor(sensor.type)}`}>
            {getSensorIcon(sensor.type)}
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-800">{sensor.name}</Text>
            <Text className="text-sm text-gray-500 mt-0.5">{sensor.location}</Text>
          </View>
          <View 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getStatusColor(sensor.status) }} 
          />
        </View>
        
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-end">
            <Text className="text-3xl font-bold text-gray-800">{sensor.value}</Text>
            <Text className="text-sm text-gray-500 ml-1 mb-1">{sensor.unit}</Text>
          </View>
          
          <View className="items-end">
            <BatteryIndicator level={sensor.battery} />
            <Text className="text-xs text-gray-400 mt-1">Updated: {sensor.lastUpdate}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Group sensors by status for better organization
  const groupedSensors = {
    warning: sensors.filter(s => s.status === 'warning' || s.status === 'danger'),
    normal: sensors.filter(s => s.status === 'normal')
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className={`flex-row items-center justify-between px-4 h-14 bg-white shadow-sm ${insets.top > 0 ? '' : 'pt-2.5'}`}>
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ChevronLeft width={24} height={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Sensors</Text>
        <TouchableOpacity 
          className={`w-10 h-10 rounded-full bg-gray-100 justify-center items-center ${refreshing ? 'opacity-50' : ''}`}
          onPress={refreshSensors}
          disabled={refreshing}
          accessibilityLabel="Refresh sensor data"
          accessibilityRole="button"
        >
          <RefreshCw width={20} height={20} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView 
        className="flex-1"
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-base text-gray-500">Loading sensors...</Text>
          </View>
        ) : (
          <>
            {/* Sensor Status Summary */}
            <View className="mb-4 rounded-xl overflow-hidden shadow-sm">
              <LinearGradient
                colors={['#f5f7fa', '#e8edf5']}
                className="rounded-xl"
              >
                <View className="p-4 flex-row items-center">
                  <View className="w-12 h-12 rounded-full bg-yellow-100 items-center justify-center mr-4">
                    <Sun width={24} height={24} color="#FF9800" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800 mb-1">Sensor Status</Text>
                    <Text className="text-sm text-gray-500">
                      {groupedSensors.warning.length === 0 
                        ? "All sensors functioning normally" 
                        : `${groupedSensors.warning.length} sensor${groupedSensors.warning.length > 1 ? 's' : ''} need${groupedSensors.warning.length === 1 ? 's' : ''} attention`}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
            
            {/* Sensors needing attention */}
            {groupedSensors.warning.length > 0 && (
              <View className="mb-4">
                <Text className="text-base font-semibold text-gray-800 mb-3 ml-0.5">Needs Attention</Text>
                {groupedSensors.warning.map(renderSensorCard)}
              </View>
            )}
            
            {/* Normal functioning sensors */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-3 ml-0.5">
                {groupedSensors.warning.length > 0 ? "Functioning Normally" : "All Sensors"}
              </Text>
              {groupedSensors.normal.map(renderSensorCard)}
            </View>
            
            {/* Add new sensor button */}
            <TouchableOpacity className="bg-gray-100 rounded-xl p-4 items-center mt-2 mb-4" activeOpacity={0.8}>
              <Text className="text-base text-gray-500 font-medium">+ Add New Sensor</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SensorScreen;