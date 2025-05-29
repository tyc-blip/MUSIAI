import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { fetchSpotifyData } from '../utils/spotify'; // Adjust the path as necessary

export default function TrendingHitsScreen({ navigation }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingHits();
  }, []);

  const fetchTrendingHits = async () => {
    try {
      const trendingHitsData = await fetchSpotifyData('playlists/37i9dQZF1DXcBWIGoYBM5M/tracks'); // "Today's Top Hits" playlist
      setTracks(trendingHitsData.items.filter(track => track.track.preview_url));
    } catch (error) {
      console.error('Error fetching trending hits:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.track.id}
          renderItem={({ item }) => (
            <View style={styles.trackContainer}>
              <Image source={{ uri: item.track.album.images[0].url }} style={styles.trackImage} />
              <View style={styles.trackDetails}>
                <Text style={styles.trackName}>{item.track.name}</Text>
                <Text style={styles.trackArtist}>{item.track.artists[0].name}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('MusicPlayer', { song: item.track })}>
                <Text style={styles.playText}>PLAY</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  playText: {
    color: '#6E45E2',
    fontWeight: 'bold',
  },
});