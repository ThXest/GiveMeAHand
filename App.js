import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
  TextInput,
  FlatList,
  Image
} from 'react-native';

import Home from './src/screens/Home';
import Chat from './src/screens/Chat';
window.navigator.userAgent = "ReactNative";
// Optionally import the services that you want to use
import { auth } from './src/firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';
import { Buffer } from "buffer";
import base64 from 'react-native-base64';
import { decode } from 'base-64';

if (typeof atob === 'undefined') {
  global.atob = decode;
}

const Stack = createNativeStackNavigator();

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  return (
    <View style={{ marginTop: '10%' }}>
      <TextInput onChangeText={setEmail} value={email} placeholder='Email' />
      <TextInput onChangeText={setPassword} value={password} placeholder='Password' secureTextEntry={true} />
      <Button title="Login" onPress={() => {
        signInWithEmailAndPassword(auth, email, password).then(() => {
          Alert.alert("Signed in!");
          navigation.navigate('Profile');
        }).catch(error => {
          Alert.alert(error.code);
        });
      }} />
      <Text style={{ fontSize: 18 }}>If you have no account, <Text style={{ color: "blue" }} onPress={() => {
        navigation.navigate('NewAccount');
      }}>sign up</Text></Text>

    </View>
  );
}

export function NewAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  return (
    <View>
      <TextInput onChangeText={setEmail} value={email} placeholder='Email' />
      <TextInput onChangeText={setPassword} value={password} placeholder='Password' secureTextEntry={true} />
      <Button title="Sign Up" onPress={() => {
        createUserWithEmailAndPassword(auth, email, password).then(() => {
          Alert.alert("Signed in with new user account!");
          navigation.navigate('Profile');
        }).catch(error => {
          Alert.alert(error.code);
        });
      }} />
    </View>
  );
}


function Main() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const Stack = createNativeStackNavigator();



  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  if (!user) {
    return (
      <LoginScreen></LoginScreen>
    );
  }

  return (
    // <Profile>

    // </Profile>
    <Home />

  );
}
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen name="Main"
          component={Main} />

        <Stack.Screen name="Home"
          component={Home} />

        <Stack.Screen name="NewAccount"
          component={NewAccount} />

        <Stack.Screen name='Chat' component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;