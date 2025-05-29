import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const artists = [
  { id: 1, name: 'Dave', image: require('../assets/R 2.png') },
  { id: 2, name: 'Glass Animals', image: require('../assets/Glass-Animals 1.png') },
  { id: 3, name: 'Popcaan', image: require('../assets/R (1) 1.png') },
  { id: 4, name: 'Kendrick Lamar', image: require('../assets/Lamar.png') },
  { id: 5, name: 'Drake', image: require('../assets/Drake.png') },
  { id: 6, name: 'Roddy Ricch', image: require('../assets/Roddy Ricch.png') },
  { id: 7, name: 'Davido', image: require('../assets/Davido.png') },
  { id: 8, name: 'Burna Boy', image: require('../assets/Burna Boy.png') },
  { id: 9, name: 'Shallipopi', image: require('../assets/Shallipopi.png') },
  { id: 10, name: 'Juice WRLD', image: require('../assets/juice world.png') },
  { id: 11, name: 'Manifest', image: require('../assets/Ellipse 20.png') },
  { id: 12, name: 'Chris Brown', image: require('../assets/Ellipse 24.png') },
  { id: 13, name: 'SZA', image: require('../assets/Ellipse 25.png') },
  { id: 14, name: 'Young Thug', image: require('../assets/Ellipse 30.png') },
  { id: 15, name: 'Skepta', image: require('../assets/Ellipse 26.png') },
  { id: 16, name: 'Cardi B', image: require('../assets/Ellipse 28.png') },
  { id: 17, name: 'Gunna', image: require('../assets/Ellipse 32 (1).png') },
  { id: 18, name: 'Migos', image: require('../assets/Ellipse 29.png') },
  { id: 19, name: 'Nicki Minaj', image: require('../assets/Ellipse 31.png') },
  { id: 20, name: 'Wizkid', image: require('../assets/Ellipse 20.png') },
  { id: 21, name: 'Ice Spice', image: require('../assets/Ellipse 22.png') },
  { id: 22, name: 'Asake', image: require('../assets/Ellipse 23.png') },
  { id: 23, name: 'Annatoria', image: require('../assets/Annatoria.png') },
  { id: 24, name: 'Sarkodie', image: require('../assets/Sarkodie.png') },
  { id: 25, name: 'Omah Lah', image: require('../assets/omsh.png') },
  { id: 26, name: 'Uncle Waffles', image: require('../assets/Uncle waffles.png') },
  { id: 27, name: 'Rema', image: require('../assets/Rema.png') },
  { id: 28, name: 'Playboi Carti', image: require('../assets/Ellipse 18.png') },
  { id: 29, name: 'Rihanna', image: require('../assets/Ellipse 19.png') }
];

const ChooseArtistScreen = ({ navigation }) => {
  const [selectedArtists, setSelectedArtists] = useState([]);

  const toggleArtistSelection = (id) => {
    setSelectedArtists((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((artistId) => artistId !== id)
        : [...prevSelected, id]
    );
  };

  const handleNextPress = () => {
    if (selectedArtists.length < 3) {
      Alert.alert('Selection Error', 'Please select at least 3 artists.');
    } else {
      // Store selected artists in global state or context
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        })
      );
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Choose 3 or more artists you like.</Text>
      <TextInput style={styles.searchBar} placeholder="Search" placeholderTextColor="gray" />
      <ScrollView contentContainerStyle={styles.artistList}>
        {artists.map((artist) => (
          <TouchableOpacity key={artist.id} onPress={() => toggleArtistSelection(artist.id)}>
            <View style={[styles.artistContainer, selectedArtists.includes(artist.id) && styles.selectedArtist]}>
              <Image source={artist.image} style={styles.artistImage} />
              <Text style={styles.artistName}>{artist.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchBar: {
    width: width * 0.9,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: 'white',
    marginBottom: 20,
  },
  artistList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  artistContainer: {
    width: width / 4,
    alignItems: 'center',
    margin: 10,
  },
  selectedArtist: {
    borderWidth: 2,
    borderColor: '#6C15A2',
    borderRadius: 50,
  },
  artistImage: {
    width: 90,
    height: 90,
    borderRadius: 35,
  },
  artistName: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#6C15A2',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChooseArtistScreen;