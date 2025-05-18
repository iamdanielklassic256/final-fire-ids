import { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { AlertTriangle, MapPin, Camera, ArrowLeft, Send, CheckCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

export default function ReportScreen() {
  const { theme, isDarkMode } = useTheme();
  // Form state
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [locationText, setLocationText] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [severity, setSeverity] = useState('medium'); // low, medium, high
  const scrollViewRef = useRef();

  // Get current location
  const getLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need location permission to detect where the fire is located.');
        setIsLoadingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocode the coordinates
      const [address] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      setLocation(currentLocation.coords);

      // Format the address
      const formattedAddress = [
        address.street,
        address.city,
        address.region,
        address.postalCode,
      ].filter(Boolean).join(', ');

      setLocationAddress(formattedAddress);
      setLocationText(formattedAddress);
    } catch (error) {
      Alert.alert('Error', 'Could not get your location. Please enter it manually.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Validate and geocode manually entered location
  const handleLocationChange = async (text) => {
    setLocationText(text);
    setLocation(null); // Clear previous coordinates when text changes
    setLocationAddress('');

    if (text.length > 3) { // Only try to geocode if there's meaningful input
      try {
        const geocodeResult = await Location.geocodeAsync(text);
        if (geocodeResult.length > 0) {
          const { latitude, longitude } = geocodeResult[0];
          setLocation({ latitude, longitude });
          // Store the entered text as the address
          setLocationAddress(text);
        }
      } catch (error) {
        // Silently fail as this is just an enhancement
        console.log('Geocoding error:', error);
      }
    }
  };

  // Handle image selection
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (images.length < 3) {
        setImages([...images, result.assets[0].uri]);
      } else {
        Alert.alert('Limit reached', 'You can upload a maximum of 3 images.');
      }
    }
  };

  // Take a photo
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need camera permission to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (images.length < 3) {
        setImages([...images, result.assets[0].uri]);
      } else {
        Alert.alert('Limit reached', 'You can upload a maximum of 3 images.');
      }
    }
  };

  // Remove an image
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Submit report
  const handleSubmit = () => {
    if (!description) {
      Alert.alert('Missing information', 'Please provide a description of what you see.');
      return;
    }

    if (!location && !locationText) {
      Alert.alert('Missing location', 'Please provide the location of the fire.');
      return;
    }

    // Validate location format if manually entered
    if (!location && locationText) {
      Alert.alert('Invalid location', 'Please use the location picker or enter a valid address.');
      return;
    }

    setIsSubmitting(true);

    // Here you would typically send both the coordinates and the address
    const reportData = {
      description,
      severity,
      location: {
        coordinates: location,
        address: locationAddress || locationText,
      },
      images,
    };

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      // Reset after showing success screen for a moment
      setTimeout(() => {
        router.replace('/dashboard');
      }, 2000);
    }, 1500);
  };

  // Success screen after submission
  if (submitted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.primary }}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <View className="flex-1 items-center justify-center px-4">
          <Animated.View
            entering={FadeInDown.duration(500)}
            style={{ backgroundColor: theme.surface }}
            className="rounded-xl p-8 items-center shadow-lg w-full max-w-md"
          >
            <CheckCircle size={64} color={theme.primary} />
            <Text style={{ color: theme.text }} className="text-2xl font-bold mt-4">Thank You!</Text>
            <Text style={{ color: theme.textSecondary }} className="text-center mt-2">
              Your fire report has been submitted successfully. Authorities have been notified.
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.primary }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header Bar */}
        <View className="flex-row items-center justify-between px-4 py-2">
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Report Fire</Text>
          <View className="w-10" />
        </View>

        <View style={{ flex: 1, backgroundColor: theme.background }} className="rounded-t-xl">
          <ScrollView
            className="flex-1 p-4"
            ref={scrollViewRef}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Info Banner */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <View style={{ backgroundColor: theme.primaryLight }} className="p-4 rounded-xl mb-5 flex-row items-center">
                <AlertTriangle size={24} color={theme.primary} />
                <Text style={{ color: theme.text }} className="ml-2 flex-1">
                  Your report helps emergency services respond quickly to fires. Please provide as much detail as possible.
                </Text>
              </View>
            </Animated.View>

            {/* Fire Severity */}
            <Animated.View entering={FadeInDown.delay(200).duration(500)}>
              <Text style={{ color: theme.text }} className="text-lg font-semibold mb-2">Fire Severity</Text>
              <View className="flex-row justify-between mb-5">
                <TouchableOpacity
                  style={{
                    backgroundColor: severity === 'low' ? '#22c55e' : theme.primaryLight,
                    flex: 1,
                    marginRight: 8,
                    padding: 12,
                    borderRadius: 8
                  }}
                  onPress={() => setSeverity('low')}
                >
                  <Text style={{
                    color: severity === 'low' ? 'white' : theme.text,
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    Low
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: severity === 'medium' ? theme.primary : theme.primaryLight,
                    flex: 1,
                    marginHorizontal: 4,
                    padding: 12,
                    borderRadius: 8
                  }}
                  onPress={() => setSeverity('medium')}
                >
                  <Text style={{
                    color: severity === 'medium' ? 'white' : theme.text,
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    Medium
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: severity === 'high' ? '#dc2626' : theme.primaryLight,
                    flex: 1,
                    marginLeft: 8,
                    padding: 12,
                    borderRadius: 8
                  }}
                  onPress={() => setSeverity('high')}
                >
                  <Text style={{
                    color: severity === 'high' ? 'white' : theme.text,
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    High
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Description Input */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)}>
              <Text style={{ color: theme.text }} className="text-lg font-semibold mb-2">Description</Text>
              <TextInput
                style={{
                  backgroundColor: theme.surface,
                  color: theme.text,
                  borderColor: theme.border
                }}
                className="p-4 rounded-xl border text-base mb-5"
                placeholder="Describe what you see (smoke, flames, etc.)"
                placeholderTextColor={theme.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </Animated.View>

            {/* Location */}
            <Animated.View entering={FadeInDown.delay(400).duration(500)}>
              <Text style={{ color: theme.text }} className="text-lg font-semibold mb-2">Location</Text>
              <View className="flex-row mb-5">
                <TextInput
                  style={{
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border,
                    flex: 1
                  }}
                  className="p-4 rounded-l-xl border"
                  placeholder="Enter location or use current location"
                  placeholderTextColor={theme.textSecondary}
                  value={locationText}
                  onChangeText={handleLocationChange}
                />
                <TouchableOpacity
                  style={{ backgroundColor: theme.primary }}
                  className="p-4 rounded-r-xl items-center justify-center"
                  onPress={getLocation}
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <MapPin size={24} color="white" />
                  )}
                </TouchableOpacity>
              </View>
              {location && (
                <View style={{ backgroundColor: theme.primaryLight }} className="p-3 rounded-lg mb-5">
                  <Text style={{ color: theme.text }} className="text-sm">
                    📍 Location confirmed: {locationAddress || locationText}
                  </Text>
                </View>
              )}
            </Animated.View>

            {/* Photos */}
            <Animated.View entering={FadeInDown.delay(500).duration(500)}>
              <Text style={{ color: theme.text }} className="text-lg font-semibold mb-2">
                Photos (Optional, {3 - images.length} remaining)
              </Text>
              <View className="flex-row flex-wrap mb-5">
                {images.map((uri, index) => (
                  <View key={index} className="mr-2 mb-2 relative">
                    <Image source={{ uri }} className="w-20 h-20 rounded-lg" />
                    <TouchableOpacity
                      style={{ backgroundColor: theme.primary }}
                      className="absolute -top-2 -right-2 rounded-full w-6 h-6 items-center justify-center"
                      onPress={() => removeImage(index)}
                    >
                      <Text className="text-white font-bold">×</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {images.length < 3 && (
                  <View className="flex-row">
                    <TouchableOpacity
                      style={{ backgroundColor: theme.surface }}
                      className="w-20 h-20 rounded-lg items-center justify-center mr-2"
                      onPress={pickImage}
                    >
                      <Camera size={24} color={theme.textSecondary} />
                      <Text style={{ color: theme.textSecondary }} className="text-xs mt-1">Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ backgroundColor: theme.surface }}
                      className="w-20 h-20 rounded-lg items-center justify-center"
                      onPress={takePhoto}
                    >
                      <Camera size={24} color={theme.textSecondary} />
                      <Text style={{ color: theme.textSecondary }} className="text-xs mt-1">Camera</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Animated.View>
          </ScrollView>

          {/* Submit Button - Fixed at bottom */}
          <View style={{
            backgroundColor: theme.surface,
            borderTopColor: theme.border
          }} className="absolute bottom-0 left-0 right-0 p-4 shadow-lg border-t">
            <TouchableOpacity
              style={{ backgroundColor: theme.primary }}
              className="p-4 rounded-xl flex-row items-center justify-center"
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Send size={20} color="white" />
                  <Text className="ml-2 text-white font-bold text-lg">Submit Report</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}