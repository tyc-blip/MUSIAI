import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { playSound, stopSound, getSoundInstance } from '../utils/SoundManager';

const { width } = Dimensions.get('window');

export default function MusicPlayer({ route, navigation }) {
  const { song } = route.params;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    loadSound();
    return () => {
      unloadSound();
    };
  }, [song]);

  useEffect(() => {
    let interval = null;
    if (isPlaying && sound) {
      interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPosition(status.positionMillis);
        }
      }, 1000);
    } else if (!isPlaying && interval !== null) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sound]);

  const loadSound = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    try {
      const source = song.preview_url || song.url || song.audio_path; // Use preview_url for Spotify songs and url/audio_path for Supabase songs
      if (!source) {
        throw new Error('No audio source provided');
      }
      const { sound: newSound, status } = await Audio.Sound.createAsync({ uri: source }, { shouldPlay: true });
      setSound(newSound);
      setDuration(status.durationMillis);
      setIsPlaying(true);
      setLoading(false);
    } catch (error) {
      console.error('Error playing sound:', error);
      setLoading(false);
    }
  };

  const unloadSound = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const onSliderValueChange = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);
    }
  };

  const skipForward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      const newPosition = status.positionMillis + 15000; 
      if (newPosition < status.durationMillis) {
        await sound.setPositionAsync(newPosition);
      } else {
        await sound.setPositionAsync(status.durationMillis);
      }
      setPosition(newPosition);
    }
  };

  const skipBackward = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      const newPosition = status.positionMillis - 15000; 
      if (newPosition > 0) {
        await sound.setPositionAsync(newPosition);
      } else {
        await sound.setPositionAsync(0);
      }
      setPosition(newPosition);
    }
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
              {song.cover_image_url ? (
                <Image source={{ uri: song.cover_image_url }} style={styles.songImage} />
              ) : song.album && song.album.images && song.album.images.length > 0 ? (
                <Image source={{ uri: song.album.images[0].url }} style={styles.songImage} />
              ) : song.image_url ? (
                <Image source={{ uri: song.image_url }} style={styles.songImage} />
              ) : (
                <Image source={require('../assets/Davido.png')} style={styles.songImage} /> // Fallback image
              )}
              <View style={styles.songDetails}>
                <Text style={styles.songTitle}>{song.title || song.name}</Text>
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
                <TouchableOpacity onPress={skipBackward}>
                  <Ionicons name="play-skip-back" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={togglePlayPause}>
                  <MaterialCommunityIcons name={isPlaying ? "pause-circle" : "play-circle"} size={60} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={skipForward}>
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
  controlIcon: {
    width: 40,
    height: 40,
  },
});
