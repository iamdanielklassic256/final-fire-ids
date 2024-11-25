// components/EnhancedLoader.js
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';


const EnhancedLoader = ({ isLoading, message = 'Loading...' }) => {
  if (!isLoading) return null;

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isLoading}
      onRequestClose={() => {}}
    >
      <View style={styles.container}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    backgroundColor: '#028758',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 200,
  },
  loadingText: {
    marginTop: 10,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EnhancedLoader;