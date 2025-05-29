import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { PlayerContext } from '../PlayerContext';

const { width } = Dimensions.get('window');

export default function MusicPlayer({ route, navigation }) {
  const { song } = route.params;

  const { sound, isPlaying, togglePlayPause, onSliderValueChange, duration, position, loading, playSound } = useContext(PlayerContext);

  useEffect(() => {
    if (song) {
      const source = song.preview_url || song.url; // Use preview_url for Spotify songs and url for Supabase songs
      playSound(source);
    }
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [song]);

  // Determine the image source based on available data
  const getImageSource = () => {
    if (song.album && song.album.images && song.album.images.length > 0) {
      return { uri: song.album.images[0].url };
    } else if (song.image_url) {
      return { uri: song.image_url };
    } else if (song.cover_image_url) {
      return { uri: song.cover_image_url };
    } else if (song.image && song.image.uri) {
      return { uri: song.image.uri };
    } else {
      return require('../assets/Davido.png'); // Provide a default image or a placeholder
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#003a5a', '#582666']} style={styles.gradient}>
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={28} color="white" />
              </TouchableOpacity>
              <Image source={getImageSource()} style={styles.songImage} />
              <View style={styles.songDetails}>
                <Text style={styles.songTitle}>{song.name}</Text>
                {song.artists && song.artists.length > 0 ? (
                  <Text style={styles.songArtist}>{song.artists[0].name}</Text>
                ) : (
                  <Text style={styles.songArtist}>{song.artist}</Text>
                )}
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onValueChange={onSliderValueChange}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                thumbTintColor="#FFFFFF"
              />
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(position)}</Text>
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
              <View style={styles.controls}>
                <TouchableOpacity>
                  <MaterialIcons name="favorite-border" size={35} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="play-skip-back" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlayPause}>
                  <MaterialCommunityIcons name={isPlaying ? "pause-circle" : "play-circle"} size={60} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="play-skip-forward" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Octicons name="download" size={35} color="white" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const formatTime = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  songImage: {
    width: width - 80,
    height: width - 80,
    borderRadius: 10,
    marginTop: 50,
  },
  songDetails: {
    alignItems: 'center',
    marginTop: 20,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 10,
  },
  songArtist: {
    fontSize: 18,
    color: 'white',
  },
  slider: {
    width: '90%',
    height: 40,
    marginTop: 20,
  },
  timeContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  timeText: {
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
    alignItems: 'center',
  },
});
