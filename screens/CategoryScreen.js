import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchSpotifyData } from '../utils/spotify';

export default function CategoryScreen({ route, navigation }) {
  const { categoryId } = route.params;
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const categoryData = await fetchSpotifyData(`browse/categories/${categoryId}/playlists`);
      console.log('Fetched Category Data:', categoryData); // Log data to see structure
      setPlaylists(categoryData.playlists.items);
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPlaylist = (playlist) => {
    navigation.navigate('PlaylistScreen', { playlistId: playlist.id });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.playlistItem} onPress={() => handlePlayPlaylist(item)}>
            {item.images && item.images.length > 0 && (
              <Image source={{ uri: item.images[0].url }} style={styles.playlistImage} />
            )}
            <View style={styles.playlistDetails}>
              <Text style={styles.playlistName}>{item.name}</Text>
              <Text style={styles.playlistTracks}>{item.tracks.total} tracks</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  playlistDetails: {
    marginLeft: 15,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playlistTracks: {
    fontSize: 14,
    color: 'gray',
  },
});