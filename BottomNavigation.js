import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Ionicons, MaterialIcons, Entypo, FontAwesome} from '@expo/vector-icons'; // Import additional icon sets as needed
import { StyleSheet } from 'react-native';

import HomePageScreen from './screens/HomePageScreen';
import SearchScreen from './screens/SearchScreen';
import BrowseScreen from './screens/BrowseScreen';
import MyTunesScreen from './screens/MyTunesScreen';
import Shazam from './screens/Shazam';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  return (
    
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let IconComponent = AntDesign; // Default icon component
          const scale = focused? 1.4: 1;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home'; // Change icon when focused
            IconComponent = focused ? Entypo : AntDesign;
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search1';
            IconComponent = focused ? FontAwesome : AntDesign;
          } else if (route.name === 'Shazam') {
            iconName = focused ? 'music' : 'music';
            IconComponent = focused ? FontAwesome : FontAwesome;
          } 
           else if (route.name === 'Browse') {
            iconName = focused ? 'find' : 'find';
            IconComponent = focused ? AntDesign : AntDesign;
          } else if (route.name === 'MyProfile') {
            iconName = focused ? 'person' : 'person-outline';
            IconComponent = focused ? Ionicons : Ionicons;
          }

          // You can return any component that you like here!
          return <IconComponent name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C15A2',
        tabBarInactiveTintColor: '#1A1A1A',
        headerShown: false,
        tabBarStyle: styles.tabBar, // Apply custom styles
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen name="Home" component={HomePageScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Shazam" component={Shazam}/>
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen name="MyProfile" component={MyTunesScreen} />
    </Tab.Navigator>
  );
  
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'gray', // Gray background color
    borderRadius: 15, // Border radius
    marginHorizontal: 10, // Horizontal margin to center the tab bar
    position: 'absolute', // Absolute position to float above the content
    height: '8%',

  },

  tabBarLabel: {
    marginBottom: 5, // Adjust this value to move the text closer to the icons
  },
});

export default BottomNavigation;
