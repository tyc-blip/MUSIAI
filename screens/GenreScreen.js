import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { fetchSpotifyData } from '../utils/spotify'; // Adjust the path as necessary

export default function GenreScreen({ route, navigation }) {
  const { genre } = route.params;
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenreTracks();
  }, []);

  const fetchGenreTracks = async () => {
    setLoading(true);
    try {
      const data = await fetchSpotifyData(`recommendations?seed_genres=${genre}`);
      setTracks(data.tracks);
    } catch (error) {
      console.error('Error fetching genre tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{genre}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          tracks.map((track, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate('MusicPlayer', {
                song: {
                  'Music URL': track.preview_url,
                  'Cover Image URL': track.album.images[0].url,
                  music: track.name,
                  artist: track.artists[0].name,
                }
              })}
            >
              <View style={styles.trackContainer}>
                <Image source={{ uri: track.album.images[0].url }} style={styles.trackImage} />
                <View style={styles.trackDetails}>
                  <Text style={styles.trackName}>{track.name}</Text>
                  <Text style={styles.trackArtist}>{track.artists[0].name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6E45E2',
    marginBottom: 20,
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  trackDetails: {
    marginLeft: 10,
  },
  trackName: {
    fontSize: 18,
  },
  trackArtist: {
    fontSize: 14,
    color: 'gray',
  },
});