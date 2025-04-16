import React, { useState, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { Search, X } from 'lucide-react-native';

const BookSection = ({ selectedVersion, handleBookSelect }) => {
  // Safely handle the case when selectedVersion might be undefined
  const books = selectedVersion?.books || [];
  const versionName = selectedVersion?.name || 'Bible';

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState(books);

  // Update filtered books when books or search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = books.filter(book => 
        book.name.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredBooks(filtered);
    }
  }, [searchQuery, books]);

  // Function to clear search
  const clearSearch = () => setSearchQuery('');

  // Search component
  const SearchHeader = () => (
    <View>
      <Text className="text-white text-xl font-bold mb-4">
        {versionName}: Select Book
      </Text>
      <View className="flex-row items-center bg-gray-700 rounded-xl px-4 py-2 mb-4">
        <Search size={20} color="#9ca3af" />
        <TextInput
          className="flex-1 text-white text-base ml-2 h-10"
          placeholder="Search books..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <X size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Empty results component
  const EmptyResults = () => (
    <View className="items-center justify-center py-10">
      <Text className="text-gray-400 text-lg">No books found</Text>
      <Text className="text-gray-500 text-base mt-2">Try a different search term</Text>
      <TouchableOpacity 
        className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
        onPress={clearSearch}
      >
        <Text className="text-white font-medium">Clear Search</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      className="flex-1"
      contentContainerStyle={{ padding: 24 }}
      data={filteredBooks}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={<SearchHeader />}
      ListEmptyComponent={<EmptyResults />}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="bg-gray-800 p-4 rounded-xl mb-3"
          onPress={() => handleBookSelect(item)}
        >
          <Text className="text-white text-lg">{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default BookSection;