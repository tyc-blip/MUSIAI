import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Image, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          navigation.navigate('Main');
        }
      } catch (error) {
        console.error('Failed to fetch token from storage:', error);
      }
    };

    checkUserToken();
  }, [navigation]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
  
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('profiles')
        .select('email, password, name')
        .eq('email', email)
        .single();
  
      if (error || !data) {
        Alert.alert('Error', 'Your account doesn\'t exist');
        return;
      }
  
      const user = data;
      if (password !== user.password) {
        Alert.alert('Error', 'Email or password is wrong');
      } else {
        await AsyncStorage.setItem('userToken', 'someUniqueTokenOrValue');
        await AsyncStorage.setItem('userEmail', user.email);
        await AsyncStorage.setItem('userName', user.name);
  
        Alert.alert('Success', 'Sign-in successful!');
        navigation.navigate('ChooseArtistScreen');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
  };

  const handleEmailChange = (email) => {
    setEmail(email);
    setEmailValid(validateEmail(email));
  };

  const handleEmailSubmit = () => {
    if (validateEmail(email)) {
      this.passwordInput.focus();
    } else {
      setEmailValid(false);
    }
  };

  const handlePasswordSubmit = () => {
    if (password.length >= 8) {
      handleSignIn();
    } else {
      Alert.alert('Error', 'Password must be at least 8 characters long');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['rgba(0,0,0,0.9)', 'transparent']}
        style={styles.background}
      />
      <View style={styles.innerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AccountScreen')}>
          <Icon name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Sign In</Text>

        <TextInput
          style={[styles.input, !emailValid && styles.invalidInput]}
          placeholder="Email"
          placeholderTextColor="white"
          value={email}
          onChangeText={handleEmailChange}
          onSubmitEditing={handleEmailSubmit}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="white"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handlePasswordSubmit}
            ref={(input) => { this.passwordInput = input; }}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? "eye" : "eye-slash"} size={24} color="white" style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.recoveryText}>Recovery Password</Text>
        </TouchableOpacity>

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

        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={loading}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.signInButtonText}>Sign In</Text>}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Not A Member?
          <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={styles.registerLink}>Register Now</Text>
          </TouchableOpacity>
        </Text>
      </View>
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
  innerContainer: {
    flex: 1,
    justifyContent: 'center', // Center contents vertically
    alignItems: 'center', // Center contents horizontally
  },
  backButton: {
    alignSelf: 'flex-start',
    position: 'absolute',
    top: 20,
    left: 20,
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
  },
  invalidInput: {
    borderColor: 'red',
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
  recoveryText: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
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
    width: width * 0.7,
    marginBottom: 50,
  },
  signInButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    width: width * 0.9,
    paddingVertical: 15,
    marginBottom: 20,
  },
  signInButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
  },
  registerLink: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
