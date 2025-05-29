import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Avatar, Icon, Button, Badge } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const MyTunesScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My Tunes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
            <Icon name="settings" type="material" color="#6E45E2" />
          </TouchableOpacity>
        </View>

        <View style={styles.userSection}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <Avatar rounded size="medium" title="U" containerStyle={styles.avatar} />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.username}>USER</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Songs')}>
            <View style={styles.menuItemLeft}>
              <Icon name="music" type="material-community" color="#555" />
              <Text style={styles.menuItemLabel}>Songs</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Icon name="chevron-right" type="material" color="#555" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AlbumsScreen')}>
            <View style={styles.menuItemLeft}>
              <Icon name="album" type="material-community" color="#555" />
              <Text style={styles.menuItemLabel}>Albums</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Icon name="chevron-right" type="material" color="#555" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Songs')}>
            <View style={styles.menuItemLeft}>
              <Icon name="microphone" type="material-community" color="#555" />
              <Text style={styles.menuItemLabel}>Artists</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Icon name="chevron-right" type="material" color="#555" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProScreen')}>
            <View style={styles.menuItemLeft}>
              <Icon name="download" type="material-community" color="#555" />
              <Text style={styles.menuItemLabel}>Download</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Badge value="GO PRO" status="warning" />
              <Icon name="chevron-right" type="material" color="#555" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AlbumsScreen')}>
            <View style={styles.menuItemLeft}>
              <Icon name="playlist-music" type="material-community" color="#555" />
              <Text style={styles.menuItemLabel}>Playlists</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Icon name="chevron-right" type="material" color="#555" />
            </View>
          </TouchableOpacity>
        </View>

        {/* <Button
          title="Shuffle All"
          buttonStyle={styles.shuffleButton}
          icon={{ name: 'shuffle', type: 'material', color: 'white' }}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 20,
  },
  header: {
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#6E45E2',
  },
  userInfo: {
    marginHorizontal: 10,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editText: {
    color: '#333',
    marginTop: 5,
    fontSize: 16,
  },
  menu: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemCount: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  shuffleButton: {
    backgroundColor: '#6E45E2',
    borderRadius: 10,
    paddingVertical: 15,
  },
});

export default MyTunesScreen;