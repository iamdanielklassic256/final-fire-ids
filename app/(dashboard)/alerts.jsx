import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// Import from lucide-react-native instead of lucide-react
import { AlertTriangle, Bell, ChevronLeft, Filter, MapPin, Calendar, Info, X } from 'lucide-react-native';
import { router } from 'expo-router';

const AlertScreen = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [alerts, setAlerts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample alert data
  const sampleAlerts = {
    active: [
      {
        id: 'a1',
        type: 'warning',
        title: 'Fire Risk: High',
        location: 'Alpine County',
        distance: '15 miles away',
        timestamp: '2h ago',
        description: 'Due to high temperatures and dry conditions, fire risk is elevated in your area. Stay vigilant and avoid open flames outdoors.',
        severity: 'moderate',
      },
      {
        id: 'a2',
        type: 'emergency',
        title: 'Active Wildfire',
        location: 'Tahoe National Forest',
        distance: '28 miles away',
        timestamp: '4h ago',
        description: 'Wildfire reported in the eastern section of Tahoe National Forest. Currently 120 acres and growing. No evacuation orders for your location at this time.',
        severity: 'high',
      },
      {
        id: 'a3',
        type: 'advisory',
        title: 'Air Quality Alert',
        location: 'Your Area',
        distance: 'Current location',
        timestamp: '5h ago',
        description: 'Smoke from nearby wildfires may cause decreased air quality over the next 24 hours. Consider limiting outdoor activities, especially for those with respiratory conditions.',
        severity: 'low',
      }
    ],
    history: [
      {
        id: 'h1',
        type: 'resolved',
        title: 'Brush Fire: Contained',
        location: 'Highway 50 Corridor',
        distance: '8 miles away',
        timestamp: '2d ago',
        description: 'The brush fire reported along Highway 50 has been fully contained. No structural damage reported.',
        severity: 'moderate',
      },
      {
        id: 'h2',
        type: 'ended',
        title: 'Red Flag Warning Expired',
        location: 'County-wide',
        distance: 'All areas',
        timestamp: '3d ago',
        description: 'The Red Flag Warning issued for high fire danger conditions has expired as weather conditions have improved.',
        severity: 'low',
      },
      {
        id: 'h3',
        type: 'resolved',
        title: 'Vehicle Fire: Cleared',
        location: 'Interstate 80',
        distance: '12 miles away',
        timestamp: '4d ago',
        description: 'Vehicle fire on I-80 eastbound has been extinguished. Traffic has returned to normal.',
        severity: 'low',
      }
    ]
  };

  useEffect(() => {
    // Simulate loading data from an API
    setTimeout(() => {
      setAlerts(sampleAlerts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Get color based on alert severity
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return styles.severityLow;
      case 'moderate':
        return styles.severityModerate;
      case 'high':
        return styles.severityHigh;
      default:
        return styles.severityDefault;
    }
  };

  // Get icon based on alert type
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} color="#f97316" />; // orange-500
      case 'emergency':
        return <Bell size={20} color="#ef4444" />; // red-500
      case 'advisory':
        return <Info size={20} color="#3b82f6" />; // blue-500
      case 'resolved':
        return <X size={20} color="#22c55e" />; // green-500
      case 'ended':
        return <Info size={20} color="#6b7280" />; // gray-500
      default:
        return <Info size={20} color="#6b7280" />; // gray-500
    }
  };

  const renderAlertCard = (alert) => {
    return (
      <TouchableOpacity 
        key={alert.id} 
        style={styles.alertCard}
        accessibilityLabel={`${alert.title} alert, ${alert.severity} severity, ${alert.location}, ${alert.distance}`}
      >
        <View style={styles.alertHeader}>
          <View style={styles.alertTitleContainer}>
            <View style={styles.iconContainer}>
              {getAlertIcon(alert.type)}
            </View>
            <Text style={styles.alertTitle}>{alert.title}</Text>
          </View>
          <View style={[styles.severityDot, getSeverityColor(alert.severity)]} />
        </View>
        
        <Text style={styles.alertDescription}>
          {alert.description}
        </Text>
        
        <View style={styles.alertFooter}>
          <View style={styles.footerInfo}>
            <MapPin size={14} color="#6b7280" />
            <Text style={styles.footerText}>{alert.location} • {alert.distance}</Text>
          </View>
          <View style={styles.footerInfo}>
            <Calendar size={14} color="#6b7280" />
            <Text style={styles.footerText}>{alert.timestamp}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.headerButton}
              accessibilityLabel="Go back"
			  onPress={() => router.back()}
            >
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Fire Alerts</Text>
            <TouchableOpacity 
              style={styles.headerButton}
              accessibilityLabel="Filter alerts"
            >
              <Filter size={20} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'active' && styles.activeTabButton]}
          onPress={() => setActiveTab('active')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'active' }}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Alerts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'history' && styles.activeTabButton]}
          onPress={() => setActiveTab('history')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'history' }}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Alert History
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.loadingText}>Loading alerts...</Text>
          </View>
        ) : alerts && alerts[activeTab]?.length > 0 ? (
          alerts[activeTab].map(renderAlertCard)
        ) : (
          <View style={styles.emptyContainer}>
            <AlertTriangle size={40} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No {activeTab} alerts found</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active' 
                ? "You're all caught up! No active fire alerts in your area." 
                : "You don't have any alert history yet."}
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* Floating Emergency Button */}
      <View style={styles.emergencyButtonContainer}>
        <TouchableOpacity 
          style={styles.emergencyButton}
          accessibilityLabel="Emergency call"
        >
          <LinearGradient
            colors={['#ef4444', '#b91c1c']} // from-red-500 to-red-700
            style={styles.emergencyGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Bell size={22} color="white" />
            <Text style={styles.emergencyText}>Emergency Call</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // bg-gray-50
  },
  header: {
    height: 128, // h-32
    backgroundColor: '#000', // We'll use background image in a real app
  },
  headerGradient: {
    height: '100%',
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56, // h-14
    marginTop: 'auto',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#ea580c', // border-orange-600
  },
  tabText: {
    color: '#4b5563', // text-gray-600
    fontWeight: '500', // font-medium
    fontSize: 16,
  },
  activeTabText: {
    color: '#ea580c', // text-orange-600
    fontWeight: '600', // font-semibold
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 80,
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937', // text-gray-800
    flex: 1,
  },
  severityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  severityLow: {
    backgroundColor: '#22c55e', // bg-green-500
  },
  severityModerate: {
    backgroundColor: '#f97316', // bg-orange-500
  },
  severityHigh: {
    backgroundColor: '#ef4444', // bg-red-500
  },
  severityDefault: {
    backgroundColor: '#6b7280', // bg-gray-500
  },
  alertDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563', // text-gray-600
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280', // text-gray-500
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#4b5563', // text-gray-600
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937', // text-gray-800
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#4b5563', // text-gray-600
    textAlign: 'center',
    marginTop: 8,
  },
  emergencyButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  emergencyButton: {
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  emergencyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  emergencyText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default AlertScreen;