import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { fetchSpotifyData } from '../utils/spotify'; // Adjust the path as necessary
import { PlayerContext } from '../PlayerContext';

const { width } = Dimensions.get('window');

export default function AlbumScreen({ route, navigation }) {
  const {
    
    currentSong,
    setCurrentSong,
    
  } = useContext(PlayerContext);
  const { album } = route.params;
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbumTracks();
    return () => {
      stopSound();
    };
  }, [album]);

  const fetchAlbumTracks = async () => {
    try {
      const albumData = await fetchSpotifyData(`albums/${album.id}/tracks`);
      setTracks(albumData.items.filter(track => track.preview_url));
    } catch (error) {
      console.error('Error fetching album tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const stopSound = async () => {
    // Implement the stopSound functionality if needed
  };

  const handlePlaySong = (track) => {
    navigation.navigate('MusicPlayer', { song: track });
    setCurrentSong(track);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text style={styles.headerText}>{album.name}</Text>
            <Text style={styles.descriptionText}>{album.description}</Text>
            {tracks.map((track, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.trackContainer} 
                onPress={() => handlePlaySong(track)}
              >
                <Image
                  source={
                    album.images && album.images.length > 0
                      ? { uri: album.images[0].url }
                      : track.album && track.album.images && track.album.images.length > 0
                      ? { uri: track.album.images[0].url }
                      : track.image_url
                      ? { uri: track.image_url }
                      : track.cover_image_url
                      ? { uri: track.cover_image_url }
                      : require('../assets/Davido.png') // Provide a default image or a placeholder
                  }
                  style={styles.trackImage}
                />
                <View style={styles.trackDetails}>
                  <Text style={styles.trackName}>{track.name}</Text>
                  {album.artists && album.artists.length > 0 && (
                    <Text style={styles.trackArtist}>{album.artists[0].name}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
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
  container: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6E45E2',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  trackDetails: {
    flex: 1,
    marginLeft: 10,
  },
  trackName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackArtist: {
    fontSize: 14,
    color: 'gray',
  }, 
});
