import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

export default function RecentlyPlayedScreen({ route, navigation }) {
  const { track } = route.params;
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playSound();
    return () => {
      sound?.unloadAsync();
    };
  }, []);

  const playSound = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: track.preview_url });
      await newSound.setVolumeAsync(1.0); // Set volume to max
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
      setLoading(false);
    } catch (error) {
      console.error('Error playing sound:', error);
      setLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Image source={{ uri: track.album.images[0].url }} style={styles.trackImage} />
            <Text style={styles.trackTitle}>{track.name}</Text>
            <Text style={styles.trackArtist}>{track.artists[0].name}</Text>
            <View style={styles.controls}>
              <TouchableOpacity>
                <Image source={require('../assets/like.png')} style={styles.controlIcon} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={require('../assets/mdi_skip_previous.png')} style={styles.controlIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause}>
                <Image source={isPlaying ? require('../assets/mdi_pause_circle_filled.jpeg') : require('../assets/mdi_play_circle_filled.png')} style={styles.controlIcon} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={require('../assets/mdi_skip_next.png')} style={styles.controlIcon} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={require('../assets/Download.png')} style={styles.controlIcon} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  trackImage: {
    width: width - 40,
    height: width - 40,
    borderRadius: 10,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6E45E2',
    marginVertical: 10,
  },
  trackArtist: {
    fontSize: 18,
    color: 'gray',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
  controlIcon: {
    width: 40,
    height: 40,
  },
});