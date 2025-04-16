import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import logo from '../../assets/logo/logo.png';
import bibledata from '../../data/bible/bible.json';
import AppHeader from '../../components/home/AppHeader';
import DashboardSection from '../../components/bible/DashboardSection';

const DashboardScreen = () => {
  const [currentDate] = useState(new Date());
  const [activeSection, setActiveSection] = useState('dashboard'); // dashboard, versions, books, chapters, verses
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentVerses, setCurrentVerses] = useState([]);

  // Format date: Monday, April 14
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Sample data for dashboard elements
  const dailyVerse = {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ who strengthens me."
  };



  // Navigate to Bible reading
  const handleReadBible = () => {
    setActiveSection('versions');
  };

  // Handle version selection
  const handleVersionSelect = (version) => {
    setSelectedVersion(version);
    setActiveSection('books');
  };

  // Handle book selection
  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setActiveSection('chapters');
  };

  // Handle chapter selection
  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);

    // Find the correct verses for the selected chapter
    const version = bibledata.versions.find(v => v.name === selectedVersion.name);
    const book = version.books.find(b => b.name === selectedBook.name);
    const chapterData = book.chapters.find(c => c.number === chapter.number);

    setCurrentVerses(chapterData.verses);
    setActiveSection('verses');
  };

  // Go back to previous screen
  const handleBack = () => {
    if (activeSection === 'verses') {
      setActiveSection('chapters');
    } else if (activeSection === 'chapters') {
      setActiveSection('books');
    } else if (activeSection === 'books') {
      setActiveSection('versions');
    } else {
      setActiveSection('dashboard');
    }
  };

  // Render dashboard content
  const renderDashboard = () => (
    <DashboardSection
      handleReadBible={handleReadBible}
    />
  );

  // Render Bible versions
  const renderVersions = () => (
    <FlatList
      className="flex-1"
      contentContainerStyle={{ padding: 24 }}
      data={bibledata.versions}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <Text className="text-white text-xl font-bold mb-4">Select Bible Version</Text>
      }
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

  // Render Bible books
  const renderBooks = () => (
    <FlatList
      className="flex-1"
      contentContainerStyle={{ padding: 24 }}
      data={selectedVersion.books}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <Text className="text-white text-xl font-bold mb-2">
          {selectedVersion.name}: Select Book
        </Text>
      }
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

  // Render Bible chapters
  const renderChapters = () => {
    // Create array of chapter numbers
    const chapterNumbers = selectedBook.chapters.map(chapter => ({ number: chapter.number }));

    return (
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        <Text className="text-white text-xl font-bold mb-2">
          {selectedBook.name}: Select Chapter
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {chapterNumbers.map((chapter) => (
            <TouchableOpacity
              key={chapter.number}
              className="bg-gray-800 rounded-xl mb-3 w-16 h-16 items-center justify-center"
              onPress={() => handleChapterSelect(chapter)}
            >
              <Text className="text-white text-xl">{chapter.number}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  // Render Bible verses
  const renderVerses = () => (
    <FlatList
      className="flex-1"
      contentContainerStyle={{ padding: 24 }}
      data={currentVerses}
      keyExtractor={(item) => item.number.toString()}
      ListHeaderComponent={
        <Text className="text-white text-xl font-bold mb-4">
          {selectedBook.name} {selectedChapter.number} ({selectedVersion.name})
        </Text>
      }
      renderItem={({ item: verse }) => (
        <View className="mb-4">
          <Text className="text-white">
            <Text className="text-blue-400 font-bold">{verse.number} </Text>
            {verse.text}
          </Text>
        </View>
      )}
    />
  );

  // Determine which content to render
  const renderContent = () => {
    switch (activeSection) {
      case 'versions':
        return renderVersions();
      case 'books':
        return renderBooks();
      case 'chapters':
        return renderChapters();
      case 'verses':
        return renderVerses();
      default:
        return renderDashboard();
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 bg-gray-900">
        {/* AppHeader */}
        <AppHeader
          activeSection={activeSection}
          formattedDate={formattedDate}
          handleBack={handleBack}
        />

        {/* Main Content - No outer ScrollView wrapping the entire screen */}
        {renderContent()}
      </SafeAreaView>
    </>
  );
};

export default DashboardScreen;