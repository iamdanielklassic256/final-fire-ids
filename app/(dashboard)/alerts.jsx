import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, ImageBackground, ImageSourcePropType } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertTriangle, Bell, ChevronLeft, Filter, Map, MapPin, Phone, Shield, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';



const AlertScreen = () => {
  const insets = useSafeAreaInsets();
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
        return '#4CAF50';
      case 'moderate':
        return '#FF9800';
      case 'high':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  // Get icon based on alert type
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle width={20} height={20} color="#FF9800" />;
      case 'emergency':
        return <Bell width={20} height={20} color="#F44336" />;
      case 'advisory':
        return <Info width={20} height={20} color="#2196F3" />;
      case 'resolved':
        return <X width={20} height={20} color="#4CAF50" />;
      case 'ended':
        return <Info width={20} height={20} color="#9E9E9E" />;
      default:
        return <Info width={20} height={20} color="#9E9E9E" />;
    }
  };

  const renderAlertCard = (alert) => {
    return (
      <TouchableOpacity 
        key={alert.id} 
        style={styles.alertCard}
        activeOpacity={0.8}
        accessibilityLabel={`${alert.title} alert, ${alert.severity} severity, ${alert.location}, ${alert.distance}`}
        accessibilityRole="button"
      >
        <View style={styles.alertHeader}>
          <View style={styles.alertTitleContainer}>
            <View style={styles.alertIconContainer}>
              {getAlertIcon(alert.type)}
            </View>
            <Text style={styles.alertTitle}>{alert.title}</Text>
          </View>
          <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(alert.severity) }]} />
        </View>
        
        <Text style={styles.alertDescription}>{alert.description}</Text>
        
        <View style={styles.alertMeta}>
          <View style={styles.metaItem}>
            <MapPin width={14} height={14} color="#666" />
            <Text style={styles.metaText}>{alert.location} • {alert.distance}</Text>
          </View>
          <View style={styles.metaItem}>
            <Calendar width={14} height={14} color="#666" />
            <Text style={styles.metaText}>{alert.timestamp}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <ImageBackground 
        source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/firealert-app.appspot.com/o/header-dark.jpg?alt=media' }} 
        style={styles.headerBackground}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
          style={[styles.headerGradient, { paddingTop: insets.top }]}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <ChevronLeft width={24} height={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Fire Alerts</Text>
            <TouchableOpacity 
              style={styles.filterButton}
              accessibilityLabel="Filter alerts"
              accessibilityRole="button"
            >
              <Filter width={20} height={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'active' }}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Alerts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
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
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading alerts...</Text>
          </View>
        ) : alerts && alerts[activeTab]?.length > 0 ? (
          alerts[activeTab].map(renderAlertCard)
        ) : (
          <View style={styles.emptyContainer}>
            <AlertTriangle width={40} height={40} color="#DDD" />
            <Text style={styles.emptyText}>No {activeTab} alerts found</Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'active' 
                ? "You're all caught up! No active fire alerts in your area." 
                : "You don't have any alert history yet."}
            </Text>
          </View>
        )}
      </ScrollView>
      
      {/* Floating Emergency Button */}
      <TouchableOpacity 
        style={styles.emergencyButton}
        activeOpacity={0.9}
        accessibilityLabel="Emergency call"
        accessibilityRole="button"
      >
        <LinearGradient
          colors={['#F44336', '#D32F2F']}
          style={styles.emergencyGradient}
        >
          <Bell width={22} height={22} color="#FFF" />
          <Text style={styles.emergencyText}>Emergency Call</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerBackground: {
    height: 120,
  },
  headerGradient: {
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#FF4500',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#FF4500',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
    paddingBottom: 80, // Extra space for the floating button
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
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  alertCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  alertIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  alertDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emergencyButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 28,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emergencyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
  },
  emergencyText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AlertScreen;