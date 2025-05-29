import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Avatar, Button, Icon, Badge } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({navigation}) => {
  return (
   <SafeAreaView style = {styles.safeArea}>
    <View style={styles.header}>
        <TouchableOpacity onPress ={()=>navigation.goBack()}>
        <Ionicons name="chevron-back" size={28} color="#6E45E2" />
        </TouchableOpacity>
        <Text style={styles.headerText}></Text>
        <TouchableOpacity>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.profileSection}>
        <Avatar
          rounded
          size="large"
          icon={{ name: 'user', type: 'font-awesome' }}
          containerStyle={styles.avatar}
        />
        <Text style={styles.username}>USER</Text>
        <Text style={styles.userDetails}>User: 12 Playlists</Text>
      </View>

      <TouchableOpacity style={styles.connectButton}>
        <Text style={styles.buttonText}>Connect to Facebook</Text>
        <Icon name="arrow-forward" type="material" color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.verifyButton}>
        <Text style={styles.buttonText}>Verify Your Email</Text>
        <Icon name="arrow-forward" type="material" color="white" />
      </TouchableOpacity>

      <Text style={styles.verifyText}>
        We need you to verify your email so that we can keep your account safe.
      </Text>

      <View style={styles.infoSection}>
        <InfoRow label="username@gmail.com" status="NOT VERIFIED" />
        <InfoRow label="junior" />
        <InfoRow label="+XXXXXXXXX123" />
        <InfoRow label="12/07/98" />
        <InfoRow label="Male" />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, status }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <Text style={styles.infoText}>{label}</Text>
      {status && <Badge value={status} status="error" />}
    </View>
    <TouchableOpacity>
      <Text style={styles.editText}>Edit</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginHorizontal: 20,
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
  saveText: {
    color: '#6E45E2',
    fontSize: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#000',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  userDetails: {
    fontSize: 16,
    color: '#555',
  },
  connectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6E45E2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  verifyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  verifyText: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    color: '#333',
    fontSize: 14,
  },
  infoSection: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 0.4,
    padding: 8
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginRight: 10,
  },
  editText: {
    color: '#6E45E2',
    fontSize: 14,
  },
});

export default ProfileScreen;
