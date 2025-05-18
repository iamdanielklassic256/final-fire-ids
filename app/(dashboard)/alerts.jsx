import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// Import from lucide-react-native instead of lucide-react
import { AlertTriangle, Bell, ChevronLeft, Filter, MapPin, Calendar, Info, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

const AlertScreen = () => {
  const { theme, isDarkMode } = useTheme();
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
        return { backgroundColor: '#4CAF50' };
      case 'moderate':
        return { backgroundColor: theme.primary };
      case 'high':
        return { backgroundColor: theme.primary };
      default:
        return { backgroundColor: theme.textSecondary };
    }
  };

  // Get icon based on alert type
  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} color={theme.primary} />;
      case 'emergency':
        return <Bell size={20} color={theme.primary} />;
      case 'advisory':
        return <Info size={20} color={theme.primary} />;
      case 'resolved':
        return <X size={20} color="#4CAF50" />;
      case 'ended':
        return <Info size={20} color={theme.textSecondary} />;
      default:
        return <Info size={20} color={theme.textSecondary} />;
    }
  };

  const renderAlertCard = (alert) => {
    return (
      <TouchableOpacity
        key={alert.id}
        style={[{
          backgroundColor: theme.surface,
          shadowColor: theme.text,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
        }]}
        accessibilityLabel={`${alert.title} alert, ${alert.severity} severity, ${alert.location}, ${alert.distance}`}
      >
        <View style={styles.alertHeader}>
          <View style={styles.alertTitleContainer}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
              {getAlertIcon(alert.type)}
            </View>
            <Text style={[styles.alertTitle, { color: theme.text }]}>{alert.title}</Text>
          </View>
          <View style={[styles.severityDot, getSeverityColor(alert.severity)]} />
        </View>

        <Text style={[styles.alertDescription, { color: theme.textSecondary }]}>
          {alert.description}
        </Text>

        <View style={styles.alertFooter}>
          <View style={styles.footerInfo}>
            <MapPin size={14} color={theme.textSecondary} />
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>{alert.location} • {alert.distance}</Text>
          </View>
          <View style={styles.footerInfo}>
            <Calendar size={14} color={theme.textSecondary} />
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>{alert.timestamp}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
            accessibilityLabel="Go back"
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fire Alerts</Text>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
            accessibilityLabel="Filter alerts"
          >
            <Filter size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, {
        backgroundColor: theme.surface,
        borderBottomColor: theme.border,
        borderBottomWidth: 1,
      }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'active' && { borderBottomColor: theme.primary, borderBottomWidth: 3 }
          ]}
          onPress={() => setActiveTab('active')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'active' }}
        >
          <Text style={[
            styles.tabText,
            { color: theme.textSecondary },
            activeTab === 'active' && { color: theme.primary }
          ]}>
            Active Alerts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'history' && { borderBottomColor: theme.primary, borderBottomWidth: 3 }
          ]}
          onPress={() => setActiveTab('history')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'history' }}
        >
          <Text style={[
            styles.tabText,
            { color: theme.textSecondary },
            activeTab === 'history' && { color: theme.primary }
          ]}>
            Alert History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading alerts...</Text>
          </View>
        ) : alerts && alerts[activeTab]?.length > 0 ? (
          alerts[activeTab].map(renderAlertCard)
        ) : (
          <View style={styles.emptyContainer}>
            <AlertTriangle size={40} color={theme.textSecondary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No {activeTab} alerts found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
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
          <View style={[styles.emergencyGradient, { backgroundColor: theme.primary }]}>
            <Bell size={22} color="white" />
            <Text style={styles.emergencyText}>Emergency Call</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 128,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    marginTop: 'auto',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '500',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 80,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  severityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  alertDescription: {
    fontSize: 14,
    lineHeight: 20,
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
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
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