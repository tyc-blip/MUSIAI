import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavigation from './BottomNavigation';
import MinimizedPlayer from './MinimizedPlayer'; // Adjust path as needed

const MainLayout = () => {
  return (
    <View style={{ flex: 1 }}>
      <BottomNavigation />
      <MinimizedPlayer />
    </View>
  );
};


export default MainLayout;
