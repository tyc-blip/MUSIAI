import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayerContext } from '../PlayerContext';
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function PlayerModalScreen({ navigation }) {
  const { currentSong, isPlaying, togglePlayPause, onSliderValueChange, duration, position, } = useContext(PlayerContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#003a5a', '#582666']} style={styles.gradient}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          {currentSong && currentSong.image && (
            <Image source={{ uri: currentSong.image.uri }} style={styles.songImage} />
          )}
          {currentSong && (
            <View style={styles.songDetails}>
              <Text style={styles.songTitle}>{currentSong.title}</Text>
              <Text style={styles.songArtist}>{currentSong.artist}</Text>
            </View>
          )}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            thumbTintColor="#FFFFFF"
            onValueChange={onSliderValueChange}
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
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Helper function to format time in minutes:seconds
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
