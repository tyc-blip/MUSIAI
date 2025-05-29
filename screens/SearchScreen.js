import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env';
import { PlayerContext } from '../PlayerContext';

const { width } = Dimensions.get('window');

let token = '';

const getToken = async () => {
  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)}`
    },
    body: 'grant_type=client_credentials'
  });

  const tokenData = await tokenResponse.json();
  token = tokenData.access_token;
};

export default function SearchScreen({ navigation, route }) {
  const { currentSong, setCurrentSong } = useContext(PlayerContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    getToken();
    loadRecentSearches();

    if (route.params?.searchQuery) {
      setSearchQuery(route.params.searchQuery);
      handleSearch(); // Auto search when searchQuery is passed
    }
  }, [route.params?.searchQuery]);

  useEffect(() => {
    if (route.params?.autoPlay && searchResults.length > 0) {
      handlePlaySong(searchResults[0]); // Auto-play the first song if autoPlay is true
    }
  }, [searchResults]);

  const loadRecentSearches = async () => {
    const recent = await AsyncStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  };

  const saveRecentSearch = async (query) => {
    let recent = [...recentSearches];
    if (!recent.includes(query)) {
      if (recent.length >= 5) recent.pop();
      recent.unshift(query);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(recent));
      setRecentSearches(recent);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;

    setLoading(true);
    setSearchResults([]);

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search results from Spotify API');
      }

      const data = await response.json();
      if (!data.tracks || !data.tracks.items) {
        Alert.alert('No Results', 'No songs found matching your search query.');
        setLoading(false);
        return;
      }

      setSearchResults(data.tracks.items);
      saveRecentSearch(searchQuery);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearch = async (query) => {
    setSearchQuery(query);
    await handleSearch();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const deleteRecentSearch = async (index) => {
    let recent = [...recentSearches];
    recent.splice(index, 1);
    await AsyncStorage.setItem('recentSearches', JSON.stringify(recent));
    setRecentSearches(recent);
  };

  const renderRightActions = (index) => (
    <TouchableOpacity onPress={() => deleteRecentSearch(index)} style={styles.deleteButton}>
      <AntDesign name="delete" size={20} color="white" />
    </TouchableOpacity>
  );

  const handlePlaySong = async (song) => {
    navigation.navigate('MusicPlayer', { song });
    setCurrentSong(song);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchBar}
              placeholder="Song and Artists"
              placeholderTextColor="gray"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <AntDesign name="close" size={20} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <View style={styles.searchResultsContainer}>
            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : (
              searchResults.map((result) => (
                <TouchableOpacity key={result.id} onPress={() => handlePlaySong(result)}>
                  <View style={styles.searchResultItem}>
                    <Image source={{ uri: result.album.images[0].url }} style={styles.searchResultImage} />
                    <View style={styles.searchResultDetails}>
                      <Text style={styles.searchResultName}>{result.name}</Text>
                      <Text style={styles.searchResultArtist}>{result.artists[0].name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
          <Text style={styles.sectionTitle}>Recently Searched</Text>
          <View style={styles.recentSearchesContainer}>
            {recentSearches.map((search, index) => (
              <Swipeable key={index} renderRightActions={() => renderRightActions(index)}>
                <TouchableOpacity onPress={() => handleRecentSearch(search)} style={styles.recentSearchItem}>
                  <Text style={styles.recentSearchText}>{search}</Text>
                  <TouchableOpacity onPress={() => deleteRecentSearch(index)}>
                    <AntDesign name="close" size={20} color="gray" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Swipeable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    padding: 5,
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#f1f1f1',
  },
  clearButton: {
    marginLeft: -30,
    marginRight: 10,
  },
  cancelButton: {
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#6E45E2',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: 'black',
  },
  searchResultsContainer: {
    marginBottom: 20,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchResultImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
  },
  searchResultDetails: {
    flex: 1,
    marginLeft: 15,
  },
  searchResultName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  searchResultArtist: {
    color: '#666',
    fontSize: 14,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  recentSearchesContainer: {
    marginBottom: 20,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recentSearchText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#ff4d4f',
    borderRadius: 20,
    marginLeft: 10,
  },
});
