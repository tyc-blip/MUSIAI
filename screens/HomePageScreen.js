import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { PlayerContext } from '../PlayerContext';
import { Video } from 'expo-av';

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
    albums,
    playlists,
    recentlyPlayed,
    genres,
    recommendations,
    trendingHits,
    songs, // New addition for Primuse Songs
    loading,
    currentSong,
    setCurrentSong,
    fetchInitialData,
    playSupabaseSound,
  } = useContext(PlayerContext);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    setRefreshing(false);
  };

  const handleSongPress = async (track) => {
    await playSound(track);
    setCurrentSong(track);
    // Navigate to the MusicPlayer screen
    navigation.navigate('MusicPlayer', { song: track });
  };

  const handleSupabaseSongPress = async (song) => {
    await playSupabaseSound(song); // Play the selected song
    setCurrentSong(song);
    // Navigate to the PlayerModal screen
    navigation.navigate('PlayerModal');
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

        {/* <Text style={styles.sectionTitle}>Genres</Text>
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
        )} */}

        {/* <Text style={styles.sectionTitle}>Recently Played</Text>
        {loading ? (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {renderPlaceholderItems(10)}
          </ScrollView>
        ) : (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {recentlyPlayed.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <TouchableOpacity onPress={() => handleSongPress(item.track)}>
                  <Image source={{ uri: item.track.album.images[0].url }} style={styles.itemImage} />
                  <Text style={styles.itemText}>{item.track.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )} */}

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

        {/* <Text style={styles.sectionTitle}>Recommendations</Text>
        {loading ? (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {renderPlaceholderItems(10)}
          </ScrollView>
        ) : (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {recommendations.map((track, index) => (
              <View key={index} style={styles.itemContainer}>
                <TouchableOpacity onPress={() => handleSongPress(track)}>
                  <Image source={{ uri: track.album.images[0].url }} style={styles.itemImage} />
                  <Text style={styles.itemText}>{track.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )} */}

        <Text style={styles.sectionTitle}>Primuse Songs</Text> 
        {loading ? (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {renderPlaceholderItems(10)}
          </ScrollView>
        ) : (
          <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
            {songs.map((song, index) => (
              <View key={index} style={styles.itemContainer}>
                <TouchableOpacity onPress={() => handleSupabaseSongPress(song)}>
                  <Image source={{ uri: song.image.uri }} style={styles.itemImage} />
                  <Text style={styles.itemText}>{song.title}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

      </ScrollView>
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
    backgroundColor: '#6E45E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  goProText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
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
  sectionContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  genreContainer: {
    marginRight: 16,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#6E45E2',
    borderRadius: 25,
  },
  genreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
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
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
