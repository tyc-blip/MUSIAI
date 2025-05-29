import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Image, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { supabase } from '../config/supabaseClient';

const { width } = Dimensions.get('window');

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !repeatPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!emailPattern.test(email)) {
      Alert.alert('Invalid email format', 'Please use a valid Gmail address.');
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ name, email, password }]);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('ChooseArtistScreen');
    } catch (error) {
      console.error('Error signing up:', error.message);
      Alert.alert('Error', 'Failed to register user. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['rgba(0,0,0,0.9)', 'transparent']}
        style={styles.background}
      />
      <View style={{ top: 20 }}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('SignInScreen')}>
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="white"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="white"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="white"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? "eye" : "eye-slash"} size={24} color="white" style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Repeat Password"
            placeholderTextColor="white"
            secureTextEntry={!repeatPasswordVisible}
            value={repeatPassword}
            onChangeText={setRepeatPassword}
          />
          <TouchableOpacity onPress={() => setRepeatPasswordVisible(!repeatPasswordVisible)}>
            <Icon name={repeatPasswordVisible ? "eye" : "eye-slash"} size={24} color="white" style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity>
            <Image source={require('../assets/facebook logo.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 40 }}>
            <Image source={require('../assets/google logo.png')} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('../assets/applelogo.png')} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.signUpButtonText}>Sign Up</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#6C15A2',
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 20,
    alignSelf: 'center',
  },
  input: {
    width: width * 0.9,
    height: 50,
    backgroundColor: '#8D3BCC',
    borderRadius: 30,
    paddingHorizontal: 20,
    marginVertical: 10,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'white',
    height: 70,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.9,
    height: 50,
    backgroundColor: '#8D3BCC',
    borderRadius: 30,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'white',
    height: 70,
  },
  passwordInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  eyeIcon: {
    paddingHorizontal: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'white',
  },
  orText: {
    color: 'white',
    marginHorizontal: 10,
    fontSize: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 50,
  },
  signUpButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    width: width * 0.9,
    paddingVertical: 15,
    marginBottom: 20,
    paddingVertical: 30,
  },
  signUpButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});