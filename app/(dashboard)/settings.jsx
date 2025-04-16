import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Switch, Image, StyleSheet, Linking } from 'react-native';
import React, { useState } from 'react';
import logo from '../../assets/logo/logo.png';

const SettingScreen = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [largeText, setLargeText] = useState(false);
  
  const appVersion = "1.0.0";
  
  const handleDarkModeToggle = () => setDarkMode(!darkMode);
  const handleNotificationsToggle = () => setNotifications(!notifications);
  const handleLargeTextToggle = () => setLargeText(!largeText);
  
  const openPrivacyPolicy = () => {
    Linking.openURL('https://bible.prochurchmanager.com/privacy-policy');
  };
  
  const openTermsOfService = () => {
    Linking.openURL('https:/bible.prochurchmanager.com/terms-of-service');
  };
  
  const openSupportPage = () => {
    Linking.openURL('https://bible.prochurchmanager.com/support');
  };

  return (
    <SafeAreaView style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, darkMode ? styles.darkText : styles.lightText]}>Settings</Text>
        </View>
        
        {/* App Info Section */}
        <View style={styles.aboutSection}>
          <Image source={logo} style={styles.logo} />
          <Text style={[styles.appName, darkMode ? styles.darkText : styles.lightText]}>Bible App</Text>
          <Text style={[styles.appVersion, darkMode ? styles.greyText : styles.darkGreyText]}>Version {appVersion}</Text>
          <Text style={[styles.appDescription, darkMode ? styles.greyText : styles.darkGreyText]}>
            Your daily companion for Bible study and spiritual growth
          </Text>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode ? styles.darkText : styles.lightText]}>Preferences</Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, darkMode ? styles.darkText : styles.lightText]}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, darkMode ? styles.darkText : styles.lightText]}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notifications ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, darkMode ? styles.darkText : styles.lightText]}>Large Text</Text>
            <Switch
              value={largeText}
              onValueChange={handleLargeTextToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={largeText ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>
        
        {/* Bible Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode ? styles.darkText : styles.lightText]}>Bible Settings</Text>
          
          <TouchableOpacity style={styles.settingButton}>
            <Text style={[styles.settingLabel, darkMode ? styles.darkText : styles.lightText]}>Default Bible Version</Text>
            <View style={styles.settingValue}>
              <Text style={[styles.valueText, darkMode ? styles.greyText : styles.darkGreyText]}>ESV</Text>
              <Text style={[styles.chevron, darkMode ? styles.darkText : styles.lightText]}>›</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingButton}>
            <Text style={[styles.settingLabel, darkMode ? styles.darkText : styles.lightText]}>Font Size</Text>
            <View style={styles.settingValue}>
              <Text style={[styles.valueText, darkMode ? styles.greyText : styles.darkGreyText]}>Medium</Text>
              <Text style={[styles.chevron, darkMode ? styles.darkText : styles.lightText]}>›</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingButton}>
            <Text style={[styles.settingLabel, darkMode ? styles.darkText : styles.lightText]}>Verse Display</Text>
            <View style={styles.settingValue}>
              <Text style={[styles.valueText, darkMode ? styles.greyText : styles.darkGreyText]}>Paragraph</Text>
              <Text style={[styles.chevron, darkMode ? styles.darkText : styles.lightText]}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode ? styles.darkText : styles.lightText]}>Support</Text>
          
          <TouchableOpacity style={styles.settingButton} onPress={openPrivacyPolicy}>
            <Text style={[styles.settingLabel, darkMode ? styles.darkText : styles.lightText]}>Privacy Policy</Text>
            <Text style={[styles.chevron, darkMode ? styles.darkText : styles.lightText]}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingButton} onPress={openTermsOfService}>
            <Text style={[styles.settingLabel, darkMode ? styles.darkText : styles.lightText]}>Terms of Service</Text>
            <Text style={[styles.chevron, darkMode ? styles.darkText : styles.lightText]}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingButton} onPress={openSupportPage}>
            <Text style={[styles.settingLabel, darkMode ? styles.darkText : styles.lightText]}>Help & Support</Text>
            <Text style={[styles.chevron, darkMode ? styles.darkText : styles.lightText]}>›</Text>
          </TouchableOpacity>
        </View>
        
        {/* About App Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode ? styles.darkText : styles.lightText]}>About</Text>
          
          <View style={styles.aboutContent}>
            <Text style={[styles.aboutText, darkMode ? styles.greyText : styles.darkGreyText]}>
              This Bible app was created to help you study God's Word daily, with features for reading, 
              searching, and studying the Bible. With multiple translations, devotionals, and study tools, 
              we hope this app helps deepen your faith journey.
            </Text>
            
            <Text style={[styles.aboutText, darkMode ? styles.greyText : styles.darkGreyText, {marginTop: 10}]}>
              All Bible content is provided with permission from respective copyright holders. 
              Bible text is not to be used for commercial purposes without explicit permission.
            </Text>
          </View>
        </View>
        
        {/* Credits */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, darkMode ? styles.greyText : styles.darkGreyText]}>
            © 2025 Bible App. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#f8f8f8',
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#212121',
  },
  greyText: {
    color: '#a0a0a0',
  },
  darkGreyText: {
    color: '#707070',
  },
  aboutSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginBottom: 15,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 14,
    marginBottom: 10,
  },
  appDescription: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    marginRight: 8,
  },
  chevron: {
    fontSize: 20,
  },
  aboutContent: {
    padding: 10,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
  },
});

export default SettingScreen;