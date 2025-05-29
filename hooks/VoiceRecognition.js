import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const useVoiceRecognition = () => {
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [recording, sound]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission not granted');
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
    }
  };

  const stopRecording = async () => {
    setLoading(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording URI:', uri);
      const base64Audio = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      transcribeRecording(base64Audio);
      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
    } finally {
      setLoading(false);
    }
  };

  const transcribeRecording = async (base64Audio) => {
    setTranscribing(true);
    try {
      const response = await fetch('https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyDl_WCkQugzvY_bJVdKpuFyjzaetHZqT64', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
          },
          audio: {
            content: base64Audio,
          },
        }),
      });

      const result = await response.json();
      console.log('Transcription result:', JSON.stringify(result, null, 2));
      if (result.error) {
        console.error('Transcription error:', result.error);
        setTranscription(`Error: ${result.error.message}`);
      } else if (result.results && result.results[0] && result.results[0].alternatives && result.results[0].alternatives[0].transcript) {
        const transcript = result.results[0].alternatives[0].transcript.toLowerCase();
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
      setTranscribing(false);
    }
  };

  const handleVoiceCommand = (transcript) => {
    if (transcript.includes('hey king')) {
      navigation.navigate('SpeechToText');
    }
  };

  return {
    startRecording,
    stopRecording,
    transcription,
    recording,
    loading,
    transcribing,
  };
};

export default useVoiceRecognition;