import { StatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import React, { useState, useEffect } from 'react';
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


// Optionally import the services that you want to use
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getBytes, uploadString, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { Buffer } from "buffer";
import base64 from 'react-native-base64';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBgbutiOc5TkPiNP_CXxG7Nfy4hZC5d7Hk",
  authDomain: "gdsc-7d43f.firebaseapp.com",
  projectId: "gdsc-7d43f",
  storageBucket: "gdsc-7d43f.appspot.com",
  messagingSenderId: "1077135456875",
  appId: "1:1077135456875:web:39a440e1e44bb0cf28cf2e",
  measurementId: "G-YR7B77R6YQ"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const storage = getStorage(app);

const Stack = createNativeStackNavigator();

function Profile() {
  const [image, setImage] = useState(null);
  const [links, setLinks] = useState(['no data']);
  const [image64, setImage64] = useState("");
  const user = auth.currentUser;
  const navigation = useNavigation();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
      base64: true
    });
    console.log(result.assets[0].base64.length);
    console.log(result.assets[0].mimeType);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImage64(result.assets[0].base64);
    }
  }
  return (
    <View>
      <Text style={{ fontSize: 20 }}>{user?.email}</Text>

      <Button title='Open Gallery' onPress={pickImage} />
      <Button title="Upload" onPress={async () => {
        const reference = ref(storage, "/images/" + user?.email + "/" + "deneme2");
        var temp = base64.decode(`${image64}`);
        var binaryString = base64.encode(temp);

        var len = binaryString.length;
        var bytes = new Uint8Array(len);
        console.log(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        console.log(image64.length);
        uploadString(reference, image64, 'base64').then((snapshot) => {
          console.log('Uploaded a str!');
        });
      }} />

      <Button title='Download' onPress={async () => {
        getDownloadURL(ref(storage, "/images/" + user?.email + "/" + "deneme2"))
          .then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'text';
            xhr.onload = (event) => {
              const blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();
            console.log(url);
          })
          .catch((error) => {
            // Handle any errors
          });
      }} />
      <Button title='Sign Out' onPress={async () => {
        await auth.signOut().then(() => {
          Alert.alert("Signed out!");
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        });
      }} />
      <Button title="List file links" onPress={() => {
        const reference = storage().ref("/images/" + user?.email);
        reference.listAll().then(result => {
          var newArray = [];
          result.items.forEach(ref => {
            newArray.push(ref.fullPath);
          });
          setLinks(newArray);
        });

      }} />

      <FlatList data={links} renderItem={({ item }) => <Text>{item}</Text>} />
      <Image src={`data:image/jpeg;base64,${image64}`} style={{ width: '50%', height: '50%', marginHorizontal: '25%' }} />
    </View>
  );
}

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  return (
    <View>
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
        navigation.navigate(NewAccount);
      }}>sign up</Text></Text>

    </View>
  );
}

function NewAccount() {
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

  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  if (!user) {
    return (
      <Home></Home>
    );
  }

  return (
    <Profile>

    </Profile>
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

        <Stack.Screen name="Profile"
          component={Profile} />

        <Stack.Screen name="NewAccount"
          component={NewAccount} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;