import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { fetchSpotifyData } from '../utils/spotify';
import { Audio, Video } from 'expo-av';
import BottomNavigation from '../BottomNavigation';
import { supabase } from '../config/supabaseClient';
import { URL } from 'react-native-url-polyfill';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PlayerContext from '../PlayerContext';
import { playSound, stopSound } from '../utils/SoundManager';

const { width } = Dimensions.get('window');

const PlaceholderItem = () => (
  <View style={styles.placeholderItemContainer}>
    <View style={styles.placeholderItem} />
  </View>
);

const renderPlaceholderItems = (count) => {
  return Array.from({ length: count }).map((_, index) => (
    <PlaceholderItem key={index} />
  ));
};

export default function HomePageScreen({ navigation }) {
  const {
    songs,
    currentSongIndex,
    isPlaying,
    isLiked,
    loading: playerLoading,
    playSound,
    togglePlayPause,
    toggleLike,
    playNextSong,
    playPreviousSong
  } = useContext(PlayerContext);

  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [genres, setGenres] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trendingHits, setTrendingHits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const albumsData = await fetchSpotifyData('browse/new-releases');
      const playlistsData = await fetchSpotifyData('browse/featured-playlists');
      const recentlyPlayedData = await fetchSpotifyData('me/player/recently-played');
      const genresData = await fetchSpotifyData('recommendations/available-genre-seeds');
      const recommendationsData = await fetchSpotifyData('recommendations?seed_genres=pop');
      const trendingHitsData = await fetchSpotifyData('playlists/37i9dQZF1DXcBWIGoYBM5M/tracks');

      let defaultRecentlyPlayed = [];
      if (!recentlyPlayedData.items || recentlyPlayedData.items.length === 0) {
        const defaultPlaylistData = await fetchSpotifyData('playlists/37i9dQZF1DXcBWIGoYBM5M/tracks');
        defaultRecentlyPlayed = defaultPlaylistData.items;
      }

      console.log('Recently Played Data:', recentlyPlayedData);
      setAlbums(albumsData.albums.items || []);
      setPlaylists(playlistsData.playlists.items || []);
      setRecentlyPlayed(recentlyPlayedData.items && recentlyPlayedData.items.length > 0 ? recentlyPlayedData.items.filter(item => item.track.preview_url) : defaultRecentlyPlayed.filter(item => item.track.preview_url));
      setGenres(genresData.genres || []);
      setRecommendations(recommendationsData.tracks.filter(track => track.preview_url) || []);
      setTrendingHits(trendingHitsData.items.filter(item => item.track.preview_url) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    setRefreshing(false);
  };

  const currentSong = songs[currentSongIndex];

  const handleSongPress = async (song) => {
    console.log('Selected song:', song); 
    await playSound(song); 
  
    // Navigate to the MusicPlayer screen
    navigation.navigate('MusicPlayer', { song });
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Music Library</Text>
        <TouchableOpacity style={styles.videoButton} onPress={() => navigation.navigate('SpeechToText')}>
          <Video
            source={require('../assets/ai-animation.mp4')}
            style={styles.video}
            resizeMode="cover"
            shouldPlay={true} 
            isLooping
            onError={(error) => console.error('Error playing video:', error)}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.goProButton} onPress={() => navigation.navigate('ProScreen')}>
          <Text style={styles.goProText}>GO PRO</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        
        <View style={styles.trendingHitsContainer}>
          <Image source={require('../assets/Trending songs.png')} style={styles.trendingHitsImage} />
          <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('TrendingHitsScreen')}>
            <Text style={styles.playButtonText}>PLAY NOW</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Genres</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {genres.map((genre, index) => (
              <View key={index} style={styles.genreContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('GenreScreen', { genre })}>
                  <Text style={styles.genreText}>{genre}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
        <Text style={styles.sectionTitle}>Classics</Text>
        {playerLoading ? (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {renderPlaceholderItems(10)}
          </ScrollView>
        ) : (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {songs.map((song, index) => (
              <View key={song.title} style={styles.itemContainer}>
                <TouchableOpacity onPress={() => handleSongPress(song)}>
                  <Image source={song.image} style={styles.itemImage} />
                  <Text style={styles.itemText}>{song.title}</Text>
                  <Text style={styles.songArtist}>{song.artist}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <Text style={styles.sectionTitle}>Recently Played</Text>
        {loading ? (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {renderPlaceholderItems(10)}
          </ScrollView>
        ) : (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {recentlyPlayed.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('MusicPlayer', { song: item.track })}>
                  <Image source={{ uri: item.track.album.images[0].url }} style={styles.itemImage} />
                  <Text style={styles.itemText}>{item.track.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <Text style={styles.sectionTitle}>New Releases</Text>
        {loading ? (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {renderPlaceholderItems(10)}
          </ScrollView>
        ) : (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {albums.map((album) => (
              <View key={album.id} style={styles.itemContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('AlbumScreen', { album })}>
                  <Image source={{ uri: album.images[0].url }} style={styles.itemImage} />
                  <Text style={styles.itemText}>{album.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <Text style={styles.sectionTitle}>Featured Playlists</Text>
        {loading ? (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {renderPlaceholderItems(10)}
          </ScrollView>
        ) : (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {playlists.map((playlist) => (
              <View key={playlist.id} style={styles.itemContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('PlaylistScreen', { playlistId: playlist.id })}>
                  <Image source={{ uri: playlist.images[0].url }} style={styles.itemImage} />
                  <Text style={styles.itemText}>{playlist.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <Text style={styles.sectionTitle}>Recommendations</Text>
        {loading ? (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {renderPlaceholderItems(10)}
          </ScrollView>
        ) : (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {recommendations.map((track, index) => (
              <View key={index} style={styles.itemContainer}>
                <TouchableOpacity onPress={() => { playSound(track); navigation.navigate('MusicPlayer', { song: track }) }}>
                  <Image source={{ uri: track.album.images[0].url }} style={styles.itemImage} />
                  <Text style={styles.itemText}>{track.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </ScrollView>
      {currentSong && (
        <TouchableOpacity onPress={() => { navigation.navigate('MusicPlayer', { song: currentSong }) }} style={styles.minimizedPlayer}>
          {currentSong.image && <Image source={currentSong.image} style={styles.minimizedImage} />}
          <View style={styles.minimizedDetails}>
            <Text style={styles.minimizedTitle}>{currentSong.title}</Text>
            <Text style={styles.minimizedArtist}>{currentSong.artist}</Text>
          </View>
          <TouchableOpacity onPress={togglePlayPause}>
            <MaterialCommunityIcons name={isPlaying ? "pause-circle" : "play-circle"} size={40} color="black" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  placeholderItemContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  placeholderItem: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  videoButton: {
    width: 40,
    height: 40,
    backgroundColor: 'transparent',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  goProButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  goProText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  container: {
    marginBottom: 120,
    flex: 1,
    paddingHorizontal: 16,
  },
  trendingHitsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  trendingHitsImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  playButton: {
    position: 'absolute',
    bottom: 0,
    left: 265,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  genreContainer: {
    marginRight: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#6E45E2',
    borderRadius: 20,
  },
  genreText: {
    color: '#fff',
    fontSize: 16,
  },
  recentlyPlayedContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  songContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 10,
  },
  songImage: {
    width: '100%',
    height: '100%',
  },
  songText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  songArtist: {
    fontSize: 12,
    color: '#555',
  },
  moodContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  moodItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  moodImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  moodText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  sectionContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  itemContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  minimizedPlayer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 70,
    padding: 5,
    backgroundColor: 'rgba(108, 21, 162, 0.8)',
    borderRadius: 15,
    marginHorizontal: 15,
  },
  minimizedImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  minimizedDetails: {
    flex: 1,
    marginLeft: 10,
  },
  minimizedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  minimizedArtist: {
    fontSize: 14,
    color: 'gray',
  },
  playButton: {
    marginHorizontal: 10,
  }
});
