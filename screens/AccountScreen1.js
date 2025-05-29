import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

export default function AccountScreen1({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/account1Image.jpg')} style={styles.backgroundImage} />

      <View style={styles.overlay}>
        <View style={styles.titleContainer}>
          <Text style={styles.primuse}>P R I M U S E</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignInScreen')}>
            <Text style={styles.signText}>SIGN IN</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={styles.signText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerTextContainer}>
          <Text style={styles.footerTextTop}>Enjoy Listening To</Text>
          <Text style={styles.footerTextBottom}>Music</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject, // Cover the whole screen
    width: width,
    height: height,
    resizeMode: 'cover', // Ensures image covers the container
  },
  overlay: {
    flex: 1,
    justifyContent: 'center', // Center contents vertically
    alignItems: 'center', // Center contents horizontally
    position: 'absolute', // Position overlay on top of the image
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  titleContainer: {
    marginBottom: height * 0.3, // Adjust margin based on screen height
  },
  primuse: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.1, // Relative font size
    textAlign: 'center', // Center text
  },
  buttonContainer: {
    marginBottom: height * 0.2, // Adjust margin based on screen height
    alignItems: 'center', // Center buttons horizontally
  },
  button: {
    backgroundColor: '#6C15A2',
    paddingVertical: height * 0.02, // Relative padding
    paddingHorizontal: width * 0.3, // Relative padding
    borderRadius: 30, // Rounded corners
    marginVertical: 10,
    alignItems: 'center', // Center text inside button
  },
  signText: {
    color: 'white',
    fontSize: width * 0.05, // Relative font size
    fontWeight: '900',
  },
  footerTextContainer: {
    position: 'absolute',
    bottom: height * 0.1, // Position text near the bottom
    alignItems: 'center', // Center text horizontally
  },
  footerTextTop: {
    color: 'white',
    fontWeight: '800',
    fontSize: width * 0.05, // Relative font size
    textAlign: 'center',
  },
  footerTextBottom: {
    color: 'white',
    fontWeight: '800',
    fontSize: width * 0.07, // Relative font size
    textAlign: 'center',
  },
});
