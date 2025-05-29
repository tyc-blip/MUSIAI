import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { PlayerContext } from './PlayerContext'; // Adjust the import path
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MinimizedPlayer = () => {
  const navigation = useNavigation();
  const { currentSong, isPlaying, togglePlayPause } = useContext(PlayerContext);

  if (!currentSong) return null;

  // Determine if the song is from Supabase or Spotify
  const isSupabaseSong = currentSong.audio_path && !currentSong.preview_url;

  const handlePress = () => {
    if (isSupabaseSong) {
      navigation.navigate('PlayerModal', { song: currentSong });
    } else {
      navigation.navigate('MusicPlayer', { song: currentSong });
    }
  };

  // Determine the image URI based on available sources
  const imageUri = currentSong.cover_image_url
    ? currentSong.cover_image_url
    : isSupabaseSong
    ? (currentSong.image?.uri || 'default_image_url') // Fallback image URL
    : (currentSong.album?.images?.[0]?.url || 'default_image_url'); // Fallback image URL

  return (
    <TouchableOpacity
      style={styles.minimizedPlayer}
      onPress={handlePress}
    >
      <Image
        source={{ uri: imageUri }}
        style={styles.minimizedImage}
      />
      <View style={styles.minimizedDetails}>
        <Text style={styles.minimizedTitle}>
          {currentSong.title || currentSong.name}
        </Text>
        <Text style={styles.minimizedArtist}>
          {currentSong.artist || currentSong.artists?.[0]?.name}
        </Text>
      </View>
      <TouchableOpacity onPress={togglePlayPause}>
        <MaterialCommunityIcons name={isPlaying ? "pause-circle" : "play-circle"} size={40} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  minimizedPlayer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: '8%',
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
    color: 'black',
  },
  minimizedArtist: {
    fontSize: 14,
    color: 'white',
  },
});

export default MinimizedPlayer;
