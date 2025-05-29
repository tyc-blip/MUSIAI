import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Alert } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';
import { GOOGLE_API_KEY } from '@env'; // Ensure you have react-native-dotenv setup

export default function PriMuseTTS() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [loading, setLoading] = useState(false);
  const [audioUri, setAudioUri] = useState('');

  const handleTranslate = async () => {
    if (!text) {
      Alert.alert('Please enter text');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
        {
          input: { text },
          voice: { languageCode: language, ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { audioContent } = response.data;
      const audioUri = `data:audio/mp3;base64,${audioContent}`;
      setAudioUri(audioUri);
    } catch (error) {
      console.error('Error translating text:', error.response ? error.response.data : error);
      Alert.alert('Error translating text', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!audioUri) {
      Alert.alert('No audio available');
      return;
    }

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error playing audio');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Text-to-Speech Translation</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text"
        value={text}
        onChangeText={setText}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter language code (e.g., en-US)"
        value={language}
        onChangeText={setLanguage}
      />
      <Button title="Translate" onPress={handleTranslate} disabled={loading} />
      <Button title="Play Audio" onPress={handlePlayAudio} disabled={!audioUri || loading} />
      {loading && <Text>Loading...</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6E45E2',
  },
  input: {
    borderWidth: 1,
    borderColor: '#6E45E2',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
});