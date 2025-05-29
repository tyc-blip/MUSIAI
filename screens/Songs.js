import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchSpotifyData } from '../utils/spotify'; // Adjust the path if needed

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadSongs = async () => {
      try {
        console.log("Fetching songs...");
        const data = await fetchSpotifyData('playlists/37i9dQZF1DXcBWIGoYBM5M/tracks'); 
        
        if (data && data.items) {
          setSongs(data.items);
        } else {
          console.log("No items in data");
          setSongs([]);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Spotify Songs</Text>
        <Text>Error fetching songs: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Primuse Songs</Text>
      {songs.length === 0 ? (
        <Text>No songs available.</Text>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.track.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('MusicPlayer', { song: item.track })}>
              <View style={styles.songContainer}>
                <Image
                  source={{ uri: item.track.album.images[0].url }}
                  style={styles.albumArt}
                />
                <View style={styles.songDetails}>
                  <Text style={styles.songTitle}>{item.track.name}</Text>
                  <Text style={styles.artistName}>{item.track.artists.map(artist => artist.name).join(', ')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  songContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  albumArt: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  songDetails: {
    flex: 1,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 16,
    color: '#555',
  },
});

export default Songs;