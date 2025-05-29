import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchSpotifyData } from '../utils/spotify'; // Adjust the path if needed

const AlbumsScreen = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        console.log("Fetching albums...");
        const data = await fetchSpotifyData('browse/new-releases'); // Adjust the endpoint if needed
        
        if (data && data.albums && data.albums.items) {
          setAlbums(data.albums.items);
        } else {
          console.log("No items in data");
          setAlbums([]);
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadAlbums();
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
        <Text style={styles.title}>Spotify Albums</Text>
        <Text>Error fetching albums: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Primuse Albums</Text>
      {albums.length === 0 ? (
        <Text>No albums available.</Text>
      ) : (
        <FlatList
          data={albums}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('AlbumScreen', { album: item })}>
              <View style={styles.albumContainer}>
                <Image
                  source={{ uri: item.images[0].url }}
                  style={styles.albumArt}
                />
                <View style={styles.albumDetails}>
                  <Text style={styles.albumTitle}>{item.name}</Text>
                  <Text style={styles.artistName}>{item.artists.map(artist => artist.name).join(', ')}</Text>
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
  albumContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  albumArt: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  albumDetails: {
    flex: 1,
  },
  albumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 16,
    color: '#555',
  },
});

export default AlbumsScreen;
