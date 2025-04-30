import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertTriangle, Bell, ChevronLeft, Map, Phone, RefreshCw, Shield, Sun, User } from 'lucide-react-native';
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
  const getSensorIcon = (type)=> {
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

  // Battery indicator component
  const BatteryIndicator = ({ level }) => {
    let color = '#4CAF50';
    if (level < 30) color = '#F44336';
    else if (level < 60) color = '#FF9800';
    
    return (
      <View style={styles.batteryContainer}>
        <Battery width={14} height={14} color="#666" />
        <View style={styles.batteryBar}>
          <View 
            style={[
              styles.batteryLevel, 
              { width: `${level}%`, backgroundColor: color }
            ]} 
          />
        </View>
        <Text style={styles.batteryText}>{level}%</Text>
      </View>
    );
  };

  // Render individual sensor card
  const renderSensorCard = (sensor) => {
    return (
      <TouchableOpacity 
        key={sensor.id}
        style={styles.sensorCard}
        activeOpacity={0.8}
        accessibilityLabel={`${sensor.name} in ${sensor.location}, value: ${sensor.value}${sensor.unit}, status: ${sensor.status}`}
        accessibilityRole="button"
      >
        <View style={styles.sensorHeader}>
          <View style={[styles.sensorIconContainer, { backgroundColor: `${getStatusColor(sensor.status)}20` }]}>
            {getSensorIcon(sensor.type)}
          </View>
          <View style={styles.sensorInfo}>
            <Text style={styles.sensorName}>{sensor.name}</Text>
            <Text style={styles.sensorLocation}>{sensor.location}</Text>
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(sensor.status) }]} />
        </View>
        
        <View style={styles.sensorDataContainer}>
          <View style={styles.sensorValue}>
            <Text style={styles.valueText}>{sensor.value}</Text>
            <Text style={styles.unitText}>{sensor.unit}</Text>
          </View>
          
          <View style={styles.sensorMeta}>
            <BatteryIndicator level={sensor.battery} />
            <Text style={styles.updateTime}>Updated: {sensor.lastUpdate}</Text>
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top > 0 ? 0 : 10 }]}>
        <TouchableOpacity 
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ChevronLeft width={24} height={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sensors</Text>
        <TouchableOpacity 
          style={[styles.refreshButton, refreshing && styles.refreshingButton]}
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
        style={styles.contentContainer}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading sensors...</Text>
          </View>
        ) : (
          <>
            {/* Sensor Status Summary */}
            <View style={styles.summaryContainer}>
              <LinearGradient
                colors={['#f5f7fa', '#e8edf5']}
                style={styles.summaryGradient}
              >
                <View style={styles.summaryContent}>
                  <View style={styles.summaryIconContainer}>
                    <Sun width={24} height={24} color="#FF9800" />
                  </View>
                  <View style={styles.summaryTextContainer}>
                    <Text style={styles.summaryTitle}>Sensor Status</Text>
                    <Text style={styles.summaryText}>
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
              <View style={styles.sensorSection}>
                <Text style={styles.sectionTitle}>Needs Attention</Text>
                {groupedSensors.warning.map(renderSensorCard)}
              </View>
            )}
            
            {/* Normal functioning sensors */}
            <View style={styles.sensorSection}>
              <Text style={styles.sectionTitle}>
                {groupedSensors.warning.length > 0 ? "Functioning Normally" : "All Sensors"}
              </Text>
              {groupedSensors.normal.map(renderSensorCard)}
            </View>
            
            {/* Add new sensor button */}
            <TouchableOpacity style={styles.addSensorButton} activeOpacity={0.8}>
              <Text style={styles.addSensorText}>+ Add New Sensor</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  refreshingButton: {
    opacity: 0.5,
  },
  contentContainer: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  summaryContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryGradient: {
    borderRadius: 12,
  },
  summaryContent: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,152,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  sensorSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginLeft: 2,
  },
  sensorCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sensorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sensorLocation: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sensorDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sensorValue: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  unitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginBottom: 4,
  },
  sensorMeta: {
    alignItems: 'flex-end',
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  batteryBar: {
    width: 40,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  batteryLevel: {
    height: '100%',
    borderRadius: 4,
  },
  batteryText: {
    fontSize: 12,
    color: '#666',
  },
  updateTime: {
    fontSize: 12,
    color: '#999',
  },
  addSensorButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  addSensorText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default SensorScreen;