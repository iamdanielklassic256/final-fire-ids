import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertTriangle, Battery, Bell, Check, ChevronLeft, Droplet, Map, Phone, RefreshCw, Shield, Sun, Thermometer, User, Wind } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const SensorScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme, isDarkMode } = useTheme();
  const [sensors, setSensors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Sample sensor data
  const sampleSensors = [
    {
      id: 's1',
      name: 'Smoke Detector',
      location: 'Forest Area 1',
      type: 'smoke',
      value: 'Clear',
      unit: 'ppm',
      status: 'normal',
      battery: 85,
      lastUpdate: '2 minutes ago',
    },
    {
      id: 's2',
      name: 'Flame Sensor',
      location: 'Forest Area 1',
      type: 'flame',
      value: 'No Flame',
      unit: '',
      status: 'normal',
      battery: 92,
      lastUpdate: '5 minutes ago',
    }
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
        if (sensor.type === 'smoke') {
          const smokeValues = ['Clear', 'Low', 'Medium', 'High'];
          const randomIndex = Math.floor(Math.random() * smokeValues.length);
          const newValue = smokeValues[randomIndex];
          const newStatus = newValue === 'Clear' ? 'normal' :
            newValue === 'Low' ? 'normal' :
              newValue === 'Medium' ? 'warning' : 'danger';
          return { ...sensor, value: newValue, status: newStatus, lastUpdate: 'Just now' };
        } else if (sensor.type === 'flame') {
          const flameValues = ['No Flame', 'Flame Detected'];
          const randomIndex = Math.floor(Math.random() * flameValues.length);
          const newValue = flameValues[randomIndex];
          const newStatus = newValue === 'No Flame' ? 'normal' : 'danger';
          return { ...sensor, value: newValue, status: newStatus, lastUpdate: 'Just now' };
        }
        return { ...sensor, lastUpdate: 'Just now' };
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
        return theme.primary;
      case 'danger':
        return theme.primary;
      default:
        return theme.textSecondary;
    }
  };

  // Get icon based on sensor type
  const getSensorIcon = (type) => {
    switch (type) {
      case 'smoke':
        return <AlertTriangle width={24} height={24} color={theme.primary} />;
      case 'flame':
        return <AlertTriangle width={24} height={24} color={theme.primary} />;
      default:
        return <Check width={24} height={24} color={theme.textSecondary} />;
    }
  };

  // Get background color based on sensor type
  const getIconBgColor = (type) => {
    return theme.primaryLight;
  };

  // Battery indicator component
  const BatteryIndicator = ({ level }) => {
    let bgColor = 'bg-green-500';
    if (level < 30) bgColor = 'bg-[#cb4523]';
    else if (level < 60) bgColor = 'bg-[#cb4523]';

    return (
      <View className="flex-row items-center">
        <Battery width={14} height={14} color={theme.textSecondary} />
        <View className="w-10 h-2 rounded-full mx-1 overflow-hidden" style={{ backgroundColor: theme.border }}>
          <View
            className={`h-full rounded-full ${bgColor}`}
            style={{ width: `${level}%` }}
          />
        </View>
        <Text style={{ color: theme.textSecondary }} className="text-xs">{level}%</Text>
      </View>
    );
  };

  // Render individual sensor card
  const renderSensorCard = (sensor) => {
    return (
      <TouchableOpacity
        key={sensor.id}
        style={{
          backgroundColor: theme.surface,
          shadowColor: theme.text,
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2
        }}
        className="rounded-xl p-4 mb-3"
        activeOpacity={0.8}
        accessibilityLabel={`${sensor.name} in ${sensor.location}, value: ${sensor.value}${sensor.unit}, status: ${sensor.status}`}
        accessibilityRole="button"
      >
        <View className="flex-row items-center mb-3">
          <View className="w-12 h-12 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: theme.primaryLight }}>
            {getSensorIcon(sensor.type)}
          </View>
          <View className="flex-1">
            <Text style={{ color: theme.text }} className="text-base font-semibold">{sensor.name}</Text>
            <Text style={{ color: theme.textSecondary }} className="text-sm mt-0.5">{sensor.location}</Text>
          </View>
          <View
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getStatusColor(sensor.status) }}
          />
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-end">
            <Text style={{ color: theme.text }} className="text-3xl font-bold">{sensor.value}</Text>
            <Text style={{ color: theme.textSecondary }} className="text-sm ml-1 mb-1">{sensor.unit}</Text>
          </View>

          <View className="items-end">
            <BatteryIndicator level={sensor.battery} />
            <Text style={{ color: theme.textSecondary }} className="text-xs mt-1">Updated: {sensor.lastUpdate}</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={{
        backgroundColor: theme.surface,
        borderBottomColor: theme.border,
        borderBottomWidth: 1,
        paddingTop: insets.top > 0 ? 0 : 10
      }} className="flex-row items-center justify-between px-4 h-14">
        <TouchableOpacity
          style={{ backgroundColor: theme.primaryLight }}
          className="w-10 h-10 rounded-full justify-center items-center"
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ChevronLeft width={24} height={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={{ color: theme.text }} className="text-xl font-bold">Sensors</Text>
        <TouchableOpacity
          style={{ backgroundColor: theme.primaryLight }}
          className={`w-10 h-10 rounded-full justify-center items-center ${refreshing ? 'opacity-50' : ''}`}
          onPress={refreshSensors}
          disabled={refreshing}
          accessibilityLabel="Refresh sensor data"
          accessibilityRole="button"
        >
          <RefreshCw width={20} height={20} color={theme.primary} />
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
            <Text style={{ color: theme.textSecondary }} className="text-base">Loading sensors...</Text>
          </View>
        ) : (
          <>
            {/* Sensor Status Summary */}
            <View className="mb-4 rounded-xl overflow-hidden shadow-sm">
              <View style={{ backgroundColor: theme.surface }}>
                <View className="p-4 flex-row items-center">
                  <View style={{ backgroundColor: theme.primaryLight }} className="w-12 h-12 rounded-full items-center justify-center mr-4">
                    <AlertTriangle width={24} height={24} color={theme.primary} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: theme.text }} className="text-base font-semibold mb-1">Sensor Status</Text>
                    <Text style={{ color: theme.textSecondary }} className="text-sm">
                      {groupedSensors.warning.length === 0
                        ? "All sensors functioning normally"
                        : `${groupedSensors.warning.length} sensor${groupedSensors.warning.length > 1 ? 's' : ''} need${groupedSensors.warning.length === 1 ? 's' : ''} attention`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Sensors needing attention */}
            {groupedSensors.warning.length > 0 && (
              <View className="mb-4">
                <Text style={{ color: theme.text }} className="text-base font-semibold mb-3 ml-0.5">Needs Attention</Text>
                {groupedSensors.warning.map(renderSensorCard)}
              </View>
            )}

            {/* Normal functioning sensors */}
            <View className="mb-4">
              <Text style={{ color: theme.text }} className="text-base font-semibold mb-3 ml-0.5">
                {groupedSensors.warning.length > 0 ? "Functioning Normally" : "All Sensors"}
              </Text>
              {groupedSensors.normal.map(renderSensorCard)}
            </View>

            {/* Add new sensor button */}
            <TouchableOpacity
              style={{ backgroundColor: theme.primary }}
              className="rounded-xl p-4 items-center mt-2 mb-4"
              activeOpacity={0.8}
            >
              <Text className="text-base text-white font-medium">+ Add New Sensor</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SensorScreen;