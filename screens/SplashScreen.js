import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const targetScreen = userToken ? 'Main' : 'AccountScreen';

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: targetScreen }],
          })
        );
      } catch (error) {
        console.error('Failed to fetch token from storage:', error);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'AccountScreen' }],
          })
        );
      }
    };

    setTimeout(checkAuth, 3000); // Check user and navigate after 3 seconds
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/Primuse_logo.png')} style={styles.logo} />
      <Text style={styles.title}>Hub of Music</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 20,
    top: -100,
  },
  title: {
    color: '#6C15A2',
    fontSize: 24,
    fontWeight: 'bold',
    top: -100,
  },
});

export default SplashScreen;
