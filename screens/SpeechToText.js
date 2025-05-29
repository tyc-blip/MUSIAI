import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Alert, StyleSheet, Modal, FlatList, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import { GOOGLE_API_KEY } from '@env';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withRepeat, withTiming, cancelAnimation } from 'react-native-reanimated';
import { fetchSpotifyData } from '../utils/spotify'; // Adjust the path as needed
import { PlayerContext } from '../PlayerContext'; // Adjust the path as needed
import { conversations } from './conversations'; // Import the conversations

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Emotion to song mapping
const emotionSongMap = {
  happy: 'happy',
  sad: 'sad',
  energetic: 'energetic',
  relaxed: 'relaxed',
  horny: 'horny'
  // Add more emotion mappings as needed
};

const AIScreen = () => {
  const [recording, setRecording] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [transcribing, setTranscribing] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [emotion, setEmotion] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [volume, setVolume] = useState(0); // Volume level (0 to 1)
  const [showVolumeBar, setShowVolumeBar] = useState(false); // To control visibility
  const recordingTimerRef = useRef(null);
  const navigation = useNavigation();
  const animationValue = useSharedValue(1);
  const volumeAnimation = useSharedValue(0); // For volume bar visibility animation

  const { playSound } = useContext(PlayerContext);

  useEffect(() => {
    if (recording) {
      recordingTimerRef.current = setInterval(() => {
        // Update timer if needed
      }, 1000);

      animationValue.value = withRepeat(
        withTiming(1.5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      cancelAnimation(animationValue);
      animationValue.value = 1;
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [recording, animationValue]);

  useEffect(() => {
    // Trigger volume bar animation and visibility
    if (showVolumeBar) {
      volumeAnimation.value = withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) }, () => {
        setTimeout(() => {
          volumeAnimation.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) }, () => {
            setShowVolumeBar(false);
          });
        }, 1000); // Duration to keep it visible
      });
    }
  }, [showVolumeBar, volumeAnimation]);

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
      await recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      await recording.startAsync();
      setRecording(recording);
      setTranscription('');
      setEmotion('');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording URI:', uri);
      setRecordingUri(uri);
      setRecording(null);

      await transcribeRecording(uri);

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
      });
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const transcribeRecording = async (uri) => {
    setTranscribing(true);
    setTranscription('...');
    let dots = '';
    const dotsInterval = setInterval(() => {
      dots += '.';
      if (dots.length > 3) {
        dots = '';
      }
      setTranscription(dots);
    }, 500);

    try {
      if (!uri) {
        throw new Error('No recording URI available');
      }

      const base64Audio = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

      const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US'
          },
          audio: {
            content: base64Audio
          }
        })
      });

      const result = await response.json();
      console.log('Transcription result:', JSON.stringify(result, null, 2));
      if (result.results && result.results[0] && result.results[0].alternatives && result.results[0].alternatives[0].transcript) {
        const transcript = result.results[0].alternatives[0].transcript.toLowerCase();
        console.log('Transcription:', transcript);
        setTranscription(transcript);
        handleVoiceCommand(transcript);
      } else {
        const errorMessage = 'Could not transcribe audio: No alternatives found';
        console.error(errorMessage);
        setTranscription(errorMessage);
      }
    } catch (err) {
      console.error('Failed to transcribe recording', err);
      setTranscription(`Failed to transcribe recording: ${err.message}`);
    } finally {
      clearInterval(dotsInterval);
      setTranscribing(false);
    }
  };

  const handleVoiceCommand = async (transcript) => {
    const cleanedTranscript = transcript.trim().toLowerCase();
    console.log('Cleaned Transcript:', cleanedTranscript);

    // Emotion handling
    const detectedEmotion = Object.keys(emotionSongMap).find(emotion => cleanedTranscript.includes(emotion));
    if (detectedEmotion) {
      setEmotion(detectedEmotion);
      await fetchSongsForEmotion(emotionSongMap[detectedEmotion]);
      speak(`Okay, you are ${detectedEmotion}. Here are some songs for you.`);
      return;
    }

    if (cleanedTranscript.startsWith('search for')) {
      const searchQuery = cleanedTranscript.replace('search for', '').trim();
      if (searchQuery) {
        Speech.speak(`Searching for ${searchQuery}`);
        navigation.navigate('SearchScreen', { searchQuery });
      } else {
        Speech.speak('Please specify what you want to search for.');
      }
    } else if (cleanedTranscript.includes('play')) {
      const songQuery = cleanedTranscript.replace('play', '').trim();
      if (songQuery) {
        Speech.speak(`Searching for ${songQuery} to play`);
        navigation.navigate('SearchScreen', { searchQuery: songQuery, autoPlay: true });
      } else {
        Speech.speak('Please specify the song you want to play.');
      }
    } else if (cleanedTranscript.includes('home')) {
      navigation.navigate('Main');
      speak('Navigating to Home Page.')}
      else if (cleanedTranscript.includes('browse')) {
        navigation.navigate('BrowseScreen');
        speak('Navigating to Browse Page.');}
      else if (cleanedTranscript.includes('my tunes')) {
          navigation.navigate('MyTunesScreen');
          speak('Navigating to My tunes screen.');}
      else if (cleanedTranscript.includes('search')) {
          navigation.navigate('SearchScreen');
          speak('Navigating to search screen.');}
      else if (cleanedTranscript.includes('shazam')) {
          navigation.navigate('ShazamScreen');
          speak('Navigating to shazam screen.');


    } else if (cleanedTranscript.includes('browse')) {
      navigation.navigate('BrowseScreen');
      speak('Navigating to Browse Screen.');
    } else if (cleanedTranscript.includes('volume')) {
      const volumeLevel = cleanedTranscript.match(/volume (\d+)/);
      if (volumeLevel && volumeLevel[1]) {
        const newVolume = Math.min(Math.max(parseInt(volumeLevel[1], 10), 0), 100) / 100;
        setVolume(newVolume);
        setShowVolumeBar(true);
        speak(`Setting volume to ${volumeLevel[1]}`);
      } else {
        speak('Please specify a volume level.');
      }
    } else {
      speak('I did not understand the command. Please try again.');
    }
  };

  const fetchSongsForEmotion = async (emotion) => {
    try {
      const data = await fetchSpotifyData(`search?q=${encodeURIComponent(emotion)}&type=track&limit=10`);
      if (data.tracks && data.tracks.items) {
        const fetchedSongs = data.tracks.items.map(track => ({
          name: track.name,
          album: track.album.name,
          preview_url: track.preview_url,
          id: track.id,
          image_url: track.album.images[0]?.url,
        }));
        setSongs(fetchedSongs);
        setShowModal(true);
      } else {
        console.error('Error: No tracks found in the response');
        setSongs([]);
      }
    } catch (err) {
      console.error('Error fetching songs:', err);
      setSongs([]);
    }
  };

  const selectSong = async (song) => {
    try {
      setSelectedSong(song);
      setShowModal(false);

      const source = song.preview_url || song.url;

      if (source) {
        navigation.navigate('MusicPlayer', { song });
      } else {
        const errorMessage = 'No preview URL available for this song';
        console.error(errorMessage);
        Alert.alert('Playback Error', errorMessage);
      }
    } catch (err) {
      console.error('Error playing selected song:', err);
      Alert.alert('Playback Error', 'An error occurred while trying to play the song.');
    }
  };

  const speak = (text) => {
    Speech.speak(text, {
      voice: 'com.apple.ttsbundle.Daniel-compact',
      rate: 0.9,
      pitch: 1.2,
    });
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animationValue.value }],
    };
  });

  const volumeStyle = useAnimatedStyle(() => {
    return {
      height: volume * 100 + '%', // Adjust the height according to the volume
      opacity: volumeAnimation.value, // Animate visibility
    };
  });

  return (
    <LinearGradient colors={['#ff5f6d', '#ffc371']} style={styles.container}>
      <View style={styles.transcriptionBox}>
        <Text style={styles.transcriptionText}>{transcription || "..."}</Text>
      </View>
      <TouchableOpacity
        style={styles.microphoneButton}
        onPress={recording ? stopRecording : startRecording}
      >
        <Animated.View style={[styles.microphoneIcon, animatedButtonStyle]} />
      </TouchableOpacity>

      {/* Volume visualization */}
      <Animated.View style={[styles.volumeBar, volumeStyle]} />

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a Song</Text>
          <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.songButton} onPress={() => selectSong(item)}>
                <View style={styles.songItem}>
                  {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.songImage} />
                  ) : (
                    <View style={styles.songImagePlaceholder} />
                  )}
                  <View style={styles.songInfo}>
                    <Text style={styles.songTitle}>{item.name}</Text>
                    <Text style={styles.songAlbum}>{item.album}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  transcriptionBox: {
    width: '80%',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  transcriptionText: {
    fontSize: 18,
    color: '#333',
  },
  microphoneButton: {
    width: 80,
    height: 80,
    backgroundColor: '#ff3b30',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  microphoneIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  volumeBar: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    width: 10,
    backgroundColor: '#ff3b30',
    borderRadius: 5,
    transform: [{ translateX: 20 }], // Adjust the position to the leftmost end
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  songButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  songImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#dcdcdc',
    marginRight: 10,
  },
  songInfo: {
    flexDirection: 'column',
  },
  songTitle: {
    fontSize: 18,
  },
  songAlbum: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    marginTop: 20,
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AIScreen;
