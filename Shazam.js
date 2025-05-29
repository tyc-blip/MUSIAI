import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity, Modal } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { AUDD_API_KEY, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Spotify access token variable
let spotifyAccessToken = '';

// Function to get Spotify access token
const getSpotifyAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)}`
        },
      }
    );
    spotifyAccessToken = response.data.access_token;
  } catch (error) {
    console.error('Error fetching Spotify access token:', error);
    Alert.alert('Error', 'Failed to fetch Spotify access token');
  }
};

// Function to search for track on Spotify
const searchSpotifyTrack = async (title, artist) => {
  try {
    if (!spotifyAccessToken) {
      await getSpotifyAccessToken();
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/search`,
      {
        params: {
          q: `track:${title} artist:${artist}`,
          type: 'track',
          limit: 1,
        },
        headers: {
          'Authorization': `Bearer ${spotifyAccessToken}`,
        },
      }
    );

    if (response.data.tracks.items.length > 0) {
      return response.data.tracks.items[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error searching Spotify track:', error);
    Alert.alert('Error', 'Failed to search track on Spotify');
    return null;
  }
};

// Main component
const Shazam = ({ navigation }) => {
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [identifiedSong, setIdentifiedSong] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Start recording audio
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission not granted');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Failed to start recording', err.message);
    }
  };

  // Stop recording audio
  const stopRecording = async () => {
    setLoading(true);
    try {
      if (!recording) {
        Alert.alert('No recording in progress');
        return;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording URI:', uri);
      setRecordingUri(uri);
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Failed to stop recording', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Identify song using AUDD API
  const identifySong = async () => {
    if (!recordingUri) {
      Alert.alert('No recording available');
      return;
    }

    setLoading(true);
    try {
      const fileInfo = await FileSystem.getInfoAsync(recordingUri);
      const fileUri = fileInfo.uri;

      const formData = new FormData();
      formData.append('api_token', AUDD_API_KEY);
      formData.append('file', {
        uri: fileUri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      });

      // Identify song using AUDD API
      const response = await axios.post('https://api.audd.io/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;
      console.log('API Response:', result);

      if (result.status === 'success' && result.result) {
        const music = result.result;
        console.log('Identified song:', music);

        // Retrieve additional information from Spotify
        const spotifySong = await searchSpotifyTrack(music.title, music.artist);

        setIdentifiedSong({
          title: music.title,
          artist: music.artist,
          album: music.album,
          release_date: music.release_date,
          genres: 'N/A',
          cover_image_url: spotifySong ? spotifySong.album.images[0].url : null,
          preview_url: spotifySong ? spotifySong.preview_url : null,
        });

        setModalVisible(true); // Show modal with song details
      } else {
        Alert.alert('Could not identify the song');
        console.log('Identification failed:', result);
      }
    } catch (err) {
      console.error('Failed to identify song', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Disable gestures when the screen is focused
      navigation.getParent().setOptions({
        gestureEnabled: false,
      });

      return () => {
        // Re-enable gestures when the screen is unfocused
        navigation.getParent().setOptions({
          gestureEnabled: true,
        });
      };
    }, [navigation])
  );

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <LinearGradient colors={['#003a5a', '#582666']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Discover the Music Around You</Text>
        <Text style={styles.descriptionText}>Tap 'Start Recording' to listen and identify any song</Text>
        <TouchableOpacity style={styles.button} onPress={recording ? stopRecording : startRecording}>
          <Text style={styles.buttonText}>{recording ? "Stop Recording" : "Start Recording"}</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#FFF" style={styles.loadingIndicator} />}
        <TouchableOpacity style={[styles.button, !recordingUri && styles.disabledButton]} onPress={identifySong} disabled={!recordingUri || loading}>
          <Text style={styles.buttonText}>Identify Song</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {identifiedSong?.cover_image_url ? (
              <Image source={{ uri: identifiedSong.cover_image_url }} style={styles.modalCoverImage} />
            ) : (
              <View style={styles.noImageContainer}>
                <Text style={styles.imageText}>No Cover Image Available</Text>
              </View>
            )}
            <Text style={styles.modalTitle}>{identifiedSong?.title}</Text>
            <Text style={styles.modalArtist}>{identifiedSong?.artist}</Text>
            
            {identifiedSong?.preview_url && (
              <TouchableOpacity style={styles.playButton} onPress={() => {
                closeModal();
                navigation.navigate('MusicPlayer', { song: identifiedSong });
              }}>
                <AntDesign name="play" size={24} color="white" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  descriptionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 100,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalArtist: {
    fontSize: 18,
    marginBottom: 10,
  },
  noImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    backgroundColor: '#ccc',
    borderRadius: 10,
  },
  modalCoverImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  imageText: {
    fontSize: 14,
  },
  playButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  closeButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
});

export default Shazam;
