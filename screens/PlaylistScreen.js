import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchSpotifyData } from '../utils/spotify';
import { PlayerContext } from '../PlayerContext';

export default function PlaylistScreen({ route, navigation }) {
  const {
    
    currentSong,
    setCurrentSong,
    
  } = useContext(PlayerContext);
  const { playlistId } = route.params;
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  const fetchPlaylistData = async () => {
    try {
      const playlistData = await fetchSpotifyData(`playlists/${playlistId}`);
      console.log('Fetched Playlist Data:', playlistData); // Log data to see structure
      if (playlistData && playlistData.tracks && playlistData.tracks.items) {
        setPlaylist(playlistData);
        setTracks(playlistData.tracks.items.map(item => item.track));
      } else {
        console.error('Invalid playlist data structure:', playlistData);
      }
    } catch (error) {
      console.error('Error fetching playlist data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (track) => {
    navigation.navigate('MusicPlayer', { song: track });
    setCurrentSong(track);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!playlist) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load playlist.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {playlist.images && playlist.images.length > 0 && (
        <View style={styles.playlistDetails}>
          <Image source={{ uri: playlist.images[0].url }} style={styles.playlistImage} />
          <Text style={styles.playlistName}>{playlist.name}</Text>
          <Text style={styles.playlistDescription}>{playlist.description}</Text>
        </View>
      )}
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.trackItem} onPress={() => handlePlaySong(item)}>
            <View style={styles.trackDetails}>
              {item.album && item.album.images && item.album.images.length > 0 && (
                <Image source={{ uri: item.album.images[0].url }} style={styles.trackImage} />
              )}
              <Text style={styles.trackName}>{item.name}</Text>
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
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  playlistDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playlistImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  playlistName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  playlistDescription: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
  trackItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  trackName: {
    fontSize: 16,
  },
});