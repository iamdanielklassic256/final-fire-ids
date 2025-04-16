import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import logo from '../../assets/logo/logo.png';
import bibledata from '../../data/bible/bible.json';
import AppHeader from '../../components/home/AppHeader';
import DashboardSection from '../../components/bible/DashboardSection';
import VersionSection from '../../components/bible/VersionSection';
import BookSection from '../../components/bible/BookSection';
import ChapterSection from '../../components/bible/ChapterSection';

const DashboardScreen = () => {
  const [currentDate] = useState(new Date());
  const [activeSection, setActiveSection] = useState('dashboard'); // dashboard, versions, books, chapters, verses
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentVerses, setCurrentVerses] = useState([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0); // Track book index for navigation

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
    // Find the index of the selected book in the version's books array
    if (selectedVersion && selectedVersion.books) {
      const bookIndex = selectedVersion.books.findIndex(b => b.name === book.name);
      setCurrentBookIndex(bookIndex >= 0 ? bookIndex : 0);
    }
    
    setSelectedBook(book);
    setActiveSection('chapters');
  };

  // Navigate to previous book
  const navigateToPreviousBook = () => {
    if (selectedVersion && currentBookIndex > 0) {
      const prevBook = selectedVersion.books[currentBookIndex - 1];
      setCurrentBookIndex(currentBookIndex - 1);
      setSelectedBook(prevBook);
      // Reset chapter selection
      setSelectedChapter(null);
    }
  };

  // Navigate to next book
  const navigateToNextBook = () => {
    if (selectedVersion && currentBookIndex < selectedVersion.books.length - 1) {
      const nextBook = selectedVersion.books[currentBookIndex + 1];
      setCurrentBookIndex(currentBookIndex + 1);
      setSelectedBook(nextBook);
      // Reset chapter selection
      setSelectedChapter(null);
    }
  };

  // Check if there are previous/next books available
  const hasPreviousBook = selectedVersion && currentBookIndex > 0;
  const hasNextBook = selectedVersion && currentBookIndex < selectedVersion.books.length - 1;

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
    <VersionSection
      handleVersionSelect={handleVersionSelect}
      bibledata={bibledata}
    />
  );

  // Render Bible books
  const renderBooks = () => (
    <BookSection
      handleBookSelect={handleBookSelect}
      selectedVersion={selectedVersion}
    />
  );

  // Render Bible chapters
  const renderChapters = () => {
    // Create array of chapter numbers
    const chapterNumbers = selectedBook.chapters.map(chapter => ({ number: chapter.number }));

    return (
      <ChapterSection
        chapterNumbers={chapterNumbers}
        handleChapterSelect={handleChapterSelect}
        selectedBook={selectedBook}
        navigateToPreviousBook={navigateToPreviousBook}
        navigateToNextBook={navigateToNextBook}
        hasPreviousBook={hasPreviousBook}
        hasNextBook={hasNextBook}
      />
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

        {/* Main Content */}
        {renderContent()}
      </SafeAreaView>
    </>
  );
};

export default DashboardScreen;