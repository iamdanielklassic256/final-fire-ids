import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar, FlatList, useColorScheme } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { router } from 'expo-router';
import logo from '../../assets/logo/logo.png';
import bibledata from '../../data/bible/bible.json';

// Create a Theme Context
const ThemeContext = React.createContext();

// Theme Provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const DashboardScreen = () => {
  const [currentDate] = useState(new Date());
  const [activeSection, setActiveSection] = useState('dashboard'); // dashboard, versions, books, chapters, verses
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentVerses, setCurrentVerses] = useState([]);
  
  // Get theme context or use system preference if no context
  const themeContext = useContext(ThemeContext);
  const systemColorScheme = useColorScheme();
  const isDarkMode = themeContext ? themeContext.isDarkMode : (systemColorScheme === 'dark');

  // Theme colors
  const theme = {
    background: isDarkMode ? 'bg-black/95' : 'bg-white',
    card: isDarkMode ? 'bg-gray-800' : 'bg-gray-200',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    subText: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    accent: 'text-blue-500',
    accentBg: 'bg-blue-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-300',
  };

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

  const devotionals = [
    { id: 1, title: "Finding Peace", verse: "John 14:27", duration: "5 min" },
    { id: 2, title: "Faith Over Fear", verse: "Isaiah 41:10", duration: "7 min" },
    { id: 3, title: "Daily Strength", verse: "Psalm 46:1", duration: "4 min" }
  ];

  const readingPlans = [
    { id: 1, title: "21 Days of Prayer", progress: 60, days: "12/21" },
    { id: 2, title: "Psalms of Comfort", progress: 30, days: "9/30" },
    { id: 3, title: "New Testament Journey", progress: 15, days: "27/180" }
  ];

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

  // Toggle dark/light mode
  const toggleTheme = () => {
    if (themeContext) {
      themeContext.toggleTheme();
    }
  };

  // Render dashboard content
  const renderDashboard = () => (
    <>
      {/* Daily Verse Card */}
      <View className={`mx-6 mb-6 p-4 ${theme.card} rounded-xl`}>
        <Text className={theme.subText + " mb-2"}>VERSE OF THE DAY</Text>
        <Text className={theme.text + " text-lg mb-2"}>{dailyVerse.text}</Text>
        <Text className={theme.accent}>{dailyVerse.reference}</Text>
      </View>

      {/* Quick Actions */}
      <View className="mx-6 mb-6 flex-row justify-between">
        <TouchableOpacity 
          className={`${theme.accentBg} rounded-xl p-4 flex-1 mr-2 items-center`}
          onPress={handleReadBible}
        >
          <Text className="text-white text-base font-medium">Read Bible</Text>
        </TouchableOpacity>
        
        {/* Theme Toggle Button */}
        <TouchableOpacity 
          className={`${theme.card} rounded-xl p-4 flex-1 ml-2 items-center`}
          onPress={toggleTheme}
        >
          <Text className={theme.text + " text-base font-medium"}>
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reading Plans (Example of additional dashboard content) */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center px-6 mb-4">
          <Text className={theme.text + " text-lg font-bold"}>Reading Plans</Text>
          <TouchableOpacity>
            <Text className={theme.accent}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 24 }}>
          {readingPlans.map(item => (
            <TouchableOpacity 
              key={item.id} 
              className={`${theme.card} rounded-xl p-4 mr-4 w-64`}
            >
              <Text className={theme.text + " text-lg mb-2"}>{item.title}</Text>
              <View className={`bg-gray-700 h-2 rounded-full w-full mb-2`}>
                <View className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.progress}%` }} />
              </View>
              <Text className={theme.subText}>{item.days} days</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );

  // Render Bible versions
  const renderVersions = () => (
    <View className="px-6">
      <Text className={theme.text + " text-xl font-bold mb-4"}>Select Bible Version</Text>
      {bibledata.versions.map((version, index) => (
        <TouchableOpacity 
          key={index}
          className={`${theme.card} p-4 rounded-xl mb-3`}
          onPress={() => handleVersionSelect(version)}
        >
          <Text className={theme.text + " text-lg"}>{version.name}</Text>
          <Text className={theme.subText}>{version.full_name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Render Bible books
  const renderBooks = () => (
    <View className="px-6 flex-1">
      <Text className={theme.text + " text-xl font-bold mb-2"}>
        {selectedVersion.name}: Select Book
      </Text>
      <FlatList
        data={selectedVersion.books}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className={`${theme.card} p-4 rounded-xl mb-3`}
            onPress={() => handleBookSelect(item)}
          >
            <Text className={theme.text + " text-lg"}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  // Render Bible chapters
  const renderChapters = () => {
    // Create array of chapter numbers
    const chapterNumbers = selectedBook.chapters.map(chapter => ({ number: chapter.number }));
    
    return (
      <View className="px-6">
        <Text className={theme.text + " text-xl font-bold mb-2"}>
          {selectedBook.name}: Select Chapter
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {chapterNumbers.map((chapter) => (
            <TouchableOpacity 
              key={chapter.number}
              className={`${theme.card} rounded-xl mb-3 w-16 h-16 items-center justify-center`}
              onPress={() => handleChapterSelect(chapter)}
            >
              <Text className={theme.text + " text-xl"}>{chapter.number}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Render Bible verses
  const renderVerses = () => (
    <View className="px-6">
      <Text className={theme.text + " text-xl font-bold mb-4"}>
        {selectedBook.name} {selectedChapter.number} ({selectedVersion.name})
      </Text>
      {currentVerses.map((verse) => (
        <View key={verse.number} className="mb-4">
          <Text className={theme.text}>
            <Text className={theme.accent + " font-bold"}>{verse.number} </Text>
            {verse.text}
          </Text>
        </View>
      ))}
    </View>
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
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <SafeAreaView className={`flex-1 ${theme.background}`}>
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 30 }}
          className={theme.background}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 pt-4 pb-6">
            <View>
              {activeSection === 'dashboard' ? (
                <>
                  <Text className={theme.text + " text-xl font-bold"}>Welcome back</Text>
                  <Text className={theme.subText}>{formattedDate}</Text>
                </>
              ) : (
                <TouchableOpacity onPress={handleBack} className="flex-row items-center">
                  <Text className={theme.accent + " text-lg"}>← Back</Text>
                </TouchableOpacity>
              )}
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity className="mr-4">
                <View className={`${theme.card} w-10 h-10 rounded-full items-center justify-center`}>
                  <Text className={theme.text + " text-lg"}>🔍</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={logo}
                  className="w-10 h-10 rounded-full"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Main Content */}
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

// Wrap your App with ThemeProvider in the main App file
// Example:
// export default function App() {
//   return (
//     <ThemeProvider>
//       <DashboardScreen />
//     </ThemeProvider>
//   );
// }

export default DashboardScreen;