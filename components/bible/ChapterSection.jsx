import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight, Book } from 'lucide-react-native';

const ChapterSection = ({ 
  handleChapterSelect, 
  selectedBook, 
  chapterNumbers,
  navigateToPreviousBook,
  navigateToNextBook,
  hasPreviousBook,
  hasNextBook
}) => {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
      {/* Header with book info */}
      <View className="flex-row items-center mb-6">
        <View className="h-10 w-10 bg-blue-500 rounded-full items-center justify-center mr-3">
          <Book size={20} color="#fff" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-xl font-bold">
            {selectedBook.name}
          </Text>
          <Text className="text-gray-400">
            Select from {chapterNumbers.length} chapters
          </Text>
        </View>
      </View>
      
      {/* Chapter grid */}
      <View className="flex-row flex-wrap justify-between">
        {chapterNumbers.map((chapter) => (
          <TouchableOpacity
            key={chapter.number}
            className="bg-gray-800 rounded-xl mb-4 w-16 h-16 items-center justify-center shadow-sm overflow-hidden"
            onPress={() => handleChapterSelect(chapter)}
          >
            <View className="absolute top-0 left-0 right-0 h-1 bg-blue-500 opacity-70" />
            <Text className="text-white text-xl font-medium">{chapter.number}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Book navigation footer */}
      <View className="flex-row justify-between items-center mt-6 pt-4 border-t border-gray-700">
        <TouchableOpacity
          className={`flex-row items-center px-4 py-3 rounded-xl ${hasPreviousBook ? 'bg-gray-800' : 'bg-gray-900 opacity-50'}`}
          onPress={navigateToPreviousBook}
          disabled={!hasPreviousBook}
        >
          <ChevronLeft size={20} color="#fff" />
          <Text className="text-white ml-2">Previous Book</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className={`flex-row items-center px-4 py-3 rounded-xl ${hasNextBook ? 'bg-gray-800' : 'bg-gray-900 opacity-50'}`}
          onPress={navigateToNextBook}
          disabled={!hasNextBook}
        >
          <Text className="text-white mr-2">Next Book</Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ChapterSection;