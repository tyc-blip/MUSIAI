import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity} from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import Animated, { FadeIn, FadeOut, FadeInUp, FadeInDown } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <View style = {styles.appContainer}>
      <StatusBar style='light'/>
      {/* <LinearGradient 
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.background}
      /> */}
      {/*lights*/}
      <View style = {styles.lights}>
        <Animated.Image 
        entering={FadeInUp.delay(200).duration(1000).springify()}
        source={require("../assets/images/light.png")}
        style = {{height:225, width: 90, }}
        />
         <Animated.Image 
         entering={FadeInUp.delay(400).duration(1000).springify()}
         source={require("../assets/images/light.png")}
         style = {{height:160, width: 65, }}
        />
      </View>
      {/*title and form */}
      <View style = {styles.loginForm}>
        {/*title */}
        <View style = {styles.title}>
          <Animated.Text entering={FadeInUp.duration(1000).springify()} style ={{color: 'white', fontWeight: 'bold', fontSize: 40}}>Login</Animated.Text>
        </View>
        {/*form */}
        <View style = {styles.form}>
          <Animated.View entering={FadeInDown.duration(1000).springify()}style = {styles.inputContainer}>
            <TextInput placeholder='Email' placeholderTextColor={'white'}/>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()}style = {styles.inputContainer}>
            <TextInput placeholder='Password' placeholderTextColor={'white'}/>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()}>
            <TouchableOpacity style = {styles.button}>
              <Text style = {{fontWeight: 'bold', fontSize: 20}}>Login</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()}style = {styles.bottomForm}>
            <Text style = {{color: 'white', marginHorizontal: 8}}>Don't have an account?</Text>
            <TouchableOpacity onPress={()=>navigation.push('Signup')}>
              <Text style = {{color: 'grey', fontWeight: 'bold', fontSize: 16}}>Sign Up Here!</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#131624',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 400,
  },
  lights: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  loginForm: {
    justifyContent: 'space-around',
    paddingTop: 40,
    paddingBottom: 10,
    flex: 1
  },
  title: {
    alignItems: 'center',
  },
  form: {
    alignItems: 'center',
    marginHorizontal: 4,
    padding: 15,
  },
  inputContainer:{
    backgroundColor:"#131624",
    padding: 10,
    marginLeft: "auto",
    marginRight: "auto",
    width: 300,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: 10,
    borderColor: "#c0c0c0",
    borderWidth: 0.8, 
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    marginLeft: "auto",
    marginRight: "auto",
    width: 300,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginVertical:10,
  },
  bottomForm:{
    flexDirection: 'row',
  }
})