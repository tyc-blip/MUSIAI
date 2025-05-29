import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { PlayerContext } from '../PlayerContext'; // adjust the import path
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PlaceholderItem = () => (
  <View style={styles.placeholderItemContainer}>
    <View style={styles.placeholderItem} />
  </View>
);

const renderPlaceholderItems = (count) => {
  return Array.from({ length: count }).map((_, index) => (
    <PlaceholderItem key={index} />
  ));
};

export default function BrowseScreen({ navigation }) {
  const {
    newReleases,
    topCharts,
    madeForYou,
    moods,
    loading,
    fetchInitialData,
  } = useContext(PlayerContext);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    setRefreshing(false);
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.headerText}>Browse</Text>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <>
            <Text style={styles.sectionTitle}>New Releases</Text>
            <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
              {renderPlaceholderItems(10)}
            </ScrollView>
            <Text style={styles.sectionTitle}>Top Charts</Text>
            <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
              {renderPlaceholderItems(10)}
            </ScrollView>
            <Text style={styles.sectionTitle}>Made Just For You</Text>
            <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
              {renderPlaceholderItems(10)}
            </ScrollView>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>New Releases</Text>
            <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
              {newReleases.map((album) => (
                <TouchableOpacity key={album.id} style={styles.itemContainer} onPress={() => navigation.navigate('AlbumScreen', { album })}>
                  <Image source={{ uri: album.images[0].url }} style={styles.itemImage} />
                  <Text style={styles.itemText}>{album.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Top Charts</Text>
            <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
              {topCharts.map((playlist) => (
                <TouchableOpacity key={playlist.id} style={styles.itemContainer} onPress={() => navigation.navigate('PlaylistScreen', { playlist })}>
                  <Image source={{ uri: playlist.images[0].url }} style={styles.itemImage} />
                  <Text style={styles.itemText}>{playlist.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Made Just For You</Text>
            <ScrollView horizontal style={styles.sectionContainer} showsHorizontalScrollIndicator={false}>
              {madeForYou.map((playlist) => (
                <TouchableOpacity key={playlist.id} style={styles.itemContainer} onPress={() => navigation.navigate('PlaylistScreen', { playlist })}>
                  <Image source={{ uri: playlist.images[0].url }} style={styles.itemImage} />
                  <Text style={styles.itemText}>{playlist.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Find Your Mood</Text>
            <View style={styles.moodsContainer}>
              {moods.map((mood, index) => (
                <TouchableOpacity key={mood.id} style={styles.moodContainer} onPress={() => navigation.navigate('CategoryScreen', { categoryId: mood.id })}>
                  <Image source={{ uri: mood.icons[0].url }} style={styles.moodImage} />
                  <Text style={styles.moodText}>{mood.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

  
   

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  headerText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6E45E2',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    marginTop: 20,
  },
  sectionContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  itemContainer: {
    marginRight: 15,
    alignItems: 'center',
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  itemText: {
    textAlign: 'center',
    marginTop: 5,
  },
  genreText: {
    color: '#fff',
    fontSize: 16,
  },
  moodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  moodContainer: {
    width: width / 2 - 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  moodImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  moodText: {
    marginTop: 5,
    textAlign: 'center',
  },
  placeholderItemContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  placeholderItem: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
  },
});
