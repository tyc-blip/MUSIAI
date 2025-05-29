import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PlayerProvider } from './PlayerContext';
import SplashScreen from './screens/SplashScreen';
import AccountScreen from './screens/AccountScreen1';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ChooseArtistScreen from './screens/ChooseArtistScreen';
import HomePageScreen from './screens/HomePageScreen';
import MusicLibraryScreen from './screens/MusicPlayer';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProScreen from './screens/ProScreen';
import MainLayout from './MainLayout';
import AIScreen from './screens/SpeechToText';
import MusicPlayer from './screens/MusicPlayer';
import SearchScreen from './screens/SearchScreen';
import BrowseScreen from './screens/BrowseScreen';
import ExploreScreen from './screens/ProfileScreen';
import MyTunesScreen from './screens/MyTunesScreen';
import PlaylistScreen from './screens/PlaylistScreen';
import AlbumScreen from './screens/AlbumScreen';
import GenreScreen from './screens/GenreScreen';
import TrendingHitsScreen from './screens/TrendingHitsScreen';
import PriMuseTTS from './screens/PriMuseTTS';
import Shazam from './screens/Shazam';
import Songs from './screens/Songs';
import CategoryScreen from './screens/CategoryScreen';
import AlbumsScreen from './screens/AlbumsScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import PlayerModalScreen from './screens/PlayerModalScreen';



const Stack = createStackNavigator();

export default function App() {
  return (
    <PlayerProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="AccountScreen" component={AccountScreen} />
          <Stack.Screen name="SignInScreen" component={SignInScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="ChooseArtistScreen" component={ChooseArtistScreen} />
          <Stack.Screen name="HomePageScreen" component={HomePageScreen} />
          <Stack.Screen name="MusicLibraryScreen" component={MusicLibraryScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="ProScreen" component={ProScreen} />
          <Stack.Screen name="Main" component={MainLayout} />
          <Stack.Screen name="SpeechToText" component={AIScreen} />
          <Stack.Screen name="MusicPlayer" component={MusicPlayer} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="BrowseScreen" component={BrowseScreen} />
          <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
          <Stack.Screen name="MyTunesScreen" component={MyTunesScreen} />
          <Stack.Screen name="PlaylistScreen" component={PlaylistScreen} />
          <Stack.Screen name="AlbumScreen" component={AlbumScreen} />
          <Stack.Screen name="GenreScreen" component={GenreScreen} />
          <Stack.Screen name="TrendingHitsScreen" component={TrendingHitsScreen} />
          <Stack.Screen name="PriMuseTTS" component={PriMuseTTS} />
          <Stack.Screen name="Shazam" component={Shazam} />
          <Stack.Screen name="Songs" component={Songs} />
          <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
          <Stack.Screen name="AlbumsScreen" component={AlbumsScreen} />
          <Stack.Screen name="ChangePasswordScreen" component ={ChangePasswordScreen}/>
          <Stack.Screen name="PlayerModal" component = {PlayerModalScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </PlayerProvider>
  );
}
