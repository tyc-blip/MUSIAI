import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ProScreen = ({navigation}) => {
  return (
    <SafeAreaView style = {styles.safeArea}>
    <View style = {styles.header}>
    <TouchableOpacity onPress={()=> navigation.goBack()}>
    <Ionicons name="chevron-back" size={28} color="#6E45E2" />
    </TouchableOpacity>
    <Text style={styles.headerText}>Go Pro</Text>
    </View>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Primuse Premium</Text>
        <Text style={styles.description}>100% Ad-Free</Text>
        <Text style={styles.description}>Unlimited Downloads</Text>
        <Text style={styles.description}>Unlimited Primuse Music</Text>
        <Text style={styles.description}>Unlimited Daily Skips</Text>
        <Text style={styles.description}>Deals & Special Offers</Text>
        <Text style={styles.description}>Exclusive Content</Text>
        <Text style={styles.description}>Listen on Sonos, Alexa & More</Text>
        <Text style={styles.description}>Cancel Anytime</Text>
        <Text style={styles.price}>GH₵25 per month</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Try free for 1 Month</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Student</Text>
        <Text style={styles.description}>Available To Only Student</Text>
        <Text style={styles.description}>Unlimited Primuse Music</Text>
        <Text style={styles.description}>Unlimited Daily Skips</Text>
        <Text style={styles.description}>Listen on Sonos, Alexa & More</Text>
        <Text style={styles.description}>Cancel Anytime</Text>
        <Text style={styles.price}>GH₵15 per month</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Try free for 1 Month</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Primuse Family</Text>
        <Text style={styles.description}>Remove all interruptions.</Text>
        <Text style={styles.description}>100% Ad Free</Text>
        <Text style={styles.description}>All Premium Access Available</Text>
        <Text style={styles.description}>Cancel Anytime</Text>
        <Text style={styles.price}>GH₵50 per month</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Try free for 1 Month</Text>
        </TouchableOpacity>
      </View>
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
    padding: 16,
    backgroundColor: '#FFF',
  },
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 25,
  },
  headerText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#6E45E2',
  },
  card: {
    backgroundColor: '#DAB3FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#6E45E2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProScreen;
