import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const [showLyrics, setShowLyrics] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [videos, setVideos] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedName = await AsyncStorage.getItem('userName');

        if (storedEmail) setEmail(storedEmail);
        if (storedName) setName(storedName);
      } catch (error) {
        console.error('Failed to fetch user data from storage:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogOut = () => {
    Alert.alert(
      'Confirm Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken'); // or your specific key
              navigation.navigate('AccountScreen');
            } catch (error) {
              console.error('Failed to log out:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#6E45E2" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
        <Avatar
          rounded
          icon={{ name: 'user', type: 'font-awesome' }}
          containerStyle={styles.avatar}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{name || 'USER'}</Text>
          <Text style={styles.email}>{email || 'username@gmail.com'}</Text>
        </View>

        <View style={styles.section}>
          <SettingOption label="Edit Profile" onPress={() => navigation.navigate('ProfileScreen')} />
          <SettingOption label="Change Password" onPress={() => navigation.navigate('ChangePasswordScreen')} />
          <SettingOption label="QR Scanner" onPress={() => {}} />
          <SettingOption label="Try Pro Mode" onPress={() => navigation.navigate('ProScreen')} />
        </View>

        <Text style={styles.sectionHeader}>Music & Playback</Text>

        <View style={styles.section}>
          <SettingOption label="Streaming quality" value="Auto" onPress={() => {}} />
          <SettingOption label="Languages" value="English" onPress={() => {}} />
          <SettingOption label="Sleep Timer" value="Off" onPress={() => {}} />
          <SettingOption label="Equalizer" value="Off" onPress={() => {}} />
          <SettingToggle label="Show Lyrics" value={showLyrics} onValueChange={setShowLyrics} />
          <SettingToggle label="Autoplay" value={autoplay} onValueChange={setAutoplay} />
          <SettingToggle label="Videos" value={videos} onValueChange={setVideos} />
        </View>

        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearOption}>Clear Recent History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearOption}>Clear Recent Searches</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
          <Text style={styles.logoutOption}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingOption = ({ label, value, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Text style={styles.optionText}>{label}</Text>
    {value && <Text style={styles.optionValue}>{value}</Text>}
    <Icon name="arrow-forward-ios" type="material" color="#6E45E2" size={16} />
  </TouchableOpacity>
);

const SettingToggle = ({ label, value, onValueChange }) => (
  <View style={styles.option}>
    <Text style={styles.optionText}>{label}</Text>
    <Switch
      trackColor={{ false: "#767577", true: "#6E45E2" }}
      thumbColor={value ? "#6E45E2" : "#f4f3f4"}
      onValueChange={onValueChange}
      value={value}
    />
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 20,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6E45E2',
  },
  avatar: {
    backgroundColor: '#000',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6E45E2',
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
  section: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6E45E2',
    marginBottom: 10,
    paddingLeft: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  optionValue: {
    fontSize: 16,
    color: '#888',
    marginRight: 10,
  },
  clearButton: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  clearOption: {
    color: '#6E45E2',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  logoutOption: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SettingsScreen;
