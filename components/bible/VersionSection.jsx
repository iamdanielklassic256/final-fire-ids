import { Search, X } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View, TextInput } from 'react-native';

const VersionSection = ({ handleVersionSelect, bibledata }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVersions, setFilteredVersions] = useState(bibledata.versions);

  // Filter versions when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVersions(bibledata.versions);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = bibledata.versions.filter(
        version => 
          version.name.toLowerCase().includes(lowercasedQuery) || 
          version.full_name.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredVersions(filtered);
    }
  }, [searchQuery, bibledata.versions]);

  // Clear search query
  const clearSearch = () => setSearchQuery('');

  // SearchBar component
  const SearchBar = () => (
    <View className="mb-6">
      <Text className="text-white text-xl font-bold mb-4">Select Bible Version</Text>
      <View className="flex-row items-center bg-gray-700 rounded-xl px-4 py-2">
        <Search width={20} height={20} stroke="#9ca3af" />
        <TextInput
          className="flex-1 text-white text-base ml-2 h-10"
          placeholder="Search bible versions..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <X width={20} height={20} stroke="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // Empty search results component
  const EmptyResults = () => (
    <View className="items-center justify-center py-10">
      <Text className="text-gray-400 text-lg">No versions found</Text>
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
      data={filteredVersions}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={<SearchBar />}
      ListEmptyComponent={<EmptyResults />}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="bg-gray-800 p-4 rounded-xl mb-3"
          onPress={() => handleVersionSelect(item)}
        >
          <Text className="text-white text-lg">{item.name}</Text>
          <Text className="text-gray-400">{item.full_name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default VersionSection;