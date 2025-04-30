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
  Image
} from 'react-native';
import { router } from 'expo-router';
import { AlertTriangle, MapPin, Camera, ArrowLeft, Send, CheckCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ReportScreen() {
  // Form state
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [locationText, setLocationText] = useState('');
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [severity, setSeverity] = useState('medium'); // low, medium, high
  const scrollViewRef = useRef();

  // Get current location
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need location permission to detect where the fire is located.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLocationText('Current location detected');
    } catch (error) {
      Alert.alert('Error', 'Could not get your location. Please enter it manually.');
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

    setIsSubmitting(true);

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
      <SafeAreaView className="flex-1 bg-orange-500">
        <View className="flex-1 items-center justify-center px-4">
          <Animated.View 
            entering={FadeInDown.duration(500)}
            className="bg-white rounded-xl p-8 items-center shadow-lg w-full max-w-md"
          >
            <CheckCircle size={64} color="#f97316" />
            <Text className="text-2xl font-bold text-gray-800 mt-4">Thank You!</Text>
            <Text className="text-gray-600 text-center mt-2">
              Your fire report has been submitted successfully. Authorities have been notified.
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-orange-500">
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

        <View className="flex-1 bg-gray-50 rounded-t-xl">
          <ScrollView 
            className="flex-1 p-4"
            ref={scrollViewRef}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Info Banner */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <View className="bg-orange-100 p-4 rounded-xl mb-5 flex-row items-center">
                <AlertTriangle size={24} color="#f97316" />
                <Text className="text-orange-800 ml-2 flex-1">
                  Your report helps emergency services respond quickly to fires. Please provide as much detail as possible.
                </Text>
              </View>
            </Animated.View>

            {/* Fire Severity */}
            <Animated.View entering={FadeInDown.delay(200).duration(500)}>
              <Text className="text-lg font-semibold text-gray-800 mb-2">Fire Severity</Text>
              <View className="flex-row justify-between mb-5">
                <TouchableOpacity
                  className={`flex-1 p-3 rounded-lg mr-2 ${severity === 'low' ? 'bg-green-500' : 'bg-green-100'}`}
                  onPress={() => setSeverity('low')}
                >
                  <Text className={`text-center font-medium ${severity === 'low' ? 'text-white' : 'text-green-800'}`}>
                    Low
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 p-3 rounded-lg mx-1 ${severity === 'medium' ? 'bg-orange-500' : 'bg-orange-100'}`}
                  onPress={() => setSeverity('medium')}
                >
                  <Text className={`text-center font-medium ${severity === 'medium' ? 'text-white' : 'text-orange-800'}`}>
                    Medium
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 p-3 rounded-lg ml-2 ${severity === 'high' ? 'bg-red-600' : 'bg-red-100'}`}
                  onPress={() => setSeverity('high')}
                >
                  <Text className={`text-center font-medium ${severity === 'high' ? 'text-white' : 'text-red-800'}`}>
                    High
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Description Input */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)}>
              <Text className="text-lg font-semibold text-gray-800 mb-2">Description</Text>
              <TextInput
                className="bg-white p-4 rounded-xl border border-gray-200 text-gray-800 mb-5"
                placeholder="Describe what you see (smoke, flames, etc.)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
            </Animated.View>

            {/* Location */}
            <Animated.View entering={FadeInDown.delay(400).duration(500)}>
              <Text className="text-lg font-semibold text-gray-800 mb-2">Location</Text>
              <View className="flex-row mb-5">
                <TextInput
                  className="bg-white p-4 rounded-l-xl border border-gray-200 text-gray-800 flex-1"
                  placeholder="Enter location or use current location"
                  value={locationText}
                  onChangeText={setLocationText}
                />
                <TouchableOpacity
                  className="bg-blue-500 p-4 rounded-r-xl items-center justify-center"
                  onPress={getLocation}
                >
                  <MapPin size={24} color="white" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Photos */}
            <Animated.View entering={FadeInDown.delay(500).duration(500)}>
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Photos (Optional, {3 - images.length} remaining)
              </Text>
              <View className="flex-row flex-wrap mb-5">
                {images.map((uri, index) => (
                  <View key={index} className="mr-2 mb-2 relative">
                    <Image source={{ uri }} className="w-20 h-20 rounded-lg" />
                    <TouchableOpacity
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                      onPress={() => removeImage(index)}
                    >
                      <Text className="text-white font-bold">×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                
                {images.length < 3 && (
                  <View className="flex-row">
                    <TouchableOpacity
                      className="bg-gray-200 w-20 h-20 rounded-lg items-center justify-center mr-2"
                      onPress={pickImage}
                    >
                      <Camera size={24} color="#4b5563" />
                      <Text className="text-xs text-gray-500 mt-1">Gallery</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      className="bg-gray-200 w-20 h-20 rounded-lg items-center justify-center"
                      onPress={takePhoto}
                    >
                      <Camera size={24} color="#4b5563" />
                      <Text className="text-xs text-gray-500 mt-1">Camera</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Animated.View>
          </ScrollView>

          {/* Submit Button - Fixed at bottom */}
          <View className="absolute bottom-0 left-0 right-0 p-4 bg-white shadow-lg border-t border-gray-200">
            <TouchableOpacity
              className="bg-orange-500 p-4 rounded-xl flex-row items-center justify-center"
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