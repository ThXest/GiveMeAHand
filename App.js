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

import Post from './src/components/Post';
import Feed from './src/screens/Feed';
import CreatePost from './src/screens/CreatePost';
import AppHome from './src/screens/Home';
import Chat from './src/screens/Chat';
window.navigator.userAgent = "ReactNative";
// Optionally import the services that you want to use
import { auth } from './src/firebase/firebase';
import { storage } from './src/firebase/firebase';
import { firestore } from './src/firebase/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { ref, uploadString, getDownloadURL, listAll } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { Buffer } from "buffer";
import base64 from 'react-native-base64';
import { decode } from 'base-64';

if (typeof atob === 'undefined') {
  global.atob = decode;
}


const Stack = createNativeStackNavigator();

function Profile() {
  const [image, setImage] = useState(null);
  const [links, setLinks] = useState(['no data']);
  const [image64, setImage64] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [postNum, setPostNum] = useState(0);
  const [postName, setPostName] = useState("");
  const [postDownload, setPostDownload] = useState("");
  const user = auth.currentUser;
  const navigation = useNavigation();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImage64(result.assets[0].base64);
    }
  }
  const findTotalPostNum = () => {
    const listRef = ref(storage, "/files/" + user?.uid);
    // Find all the prefixes and items.
    listAll(listRef)
      .then((res) => {
        /* res.prefixes.forEach((folderRef) => {

        }); */
        var totalNum = res.items.length;
        setPostNum(totalNum);
        var newArray = [];
        if (totalNum == 0) {
          newArray.push('no-data');
        }
        else {
          res.items.forEach((itemRef) => {
            newArray.push(itemRef.name);
          });
        }
        setLinks(newArray);
      }).catch((error) => {
        Alert.alert(error.code);
      });
  }

  useLayoutEffect(() => {
    findTotalPostNum();
  }, []);

  return (
    <View onLo>
      {/* <Text style={{ fontSize: 20 }}>{user?.email}</Text>
      <Button title='Open Gallery' onPress={pickImage} />
      <Button title="Upload" onPress={async () => {
        const reference = ref(storage, "/files/" + user?.uid + "/" + postName + ".txt");
        console.log(image64.length);
        uploadString(reference, image64, 'base64').then((snapshot) => {
          findTotalPostNum();
          Alert.alert('Uploaded!');
        }).catch((error) => {
          Alert.alert(error.code);
        });

      }} /> */}
      {/* <Button title='Download' onPress={async () => {
        getDownloadURL(ref(storage, "/files/" + user?.uid + "/" + postDownload + ".txt"))
          .then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'text';
            xhr.onload = (event) => {
              const text = xhr.response;
              setImageURL(text);
            };
            xhr.open('GET', url);
            xhr.send();
            Alert.alert("Downloaded!");
          })
          .catch((error) => {
            Alert.alert(error.code);
          });
      }} /> */}
      <Feed />
      <CreatePost></CreatePost>
      <Button title='Sign Out' onPress={async () => {
        await auth.signOut().then(() => {
          Alert.alert("Signed out!");
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        });
      }} />
      {/* <Text style={{ fontSize: 20, marginTop: 10 }}>Total Post Num: {postNum} (Posts are stored in base64 string format)</Text>
      <FlatList data={links} renderItem={({ item }) => <Text>{item}</Text>} />
      <View>
        <Text style={{ fontSize: 20, marginTop: 10, textAlign: 'center' }}>Photo you will upload</Text>
        <TextInput onChangeText={setPostName} value={postName} placeholder='Give your post a name (do not specify mime type)' style={{ fontSize: 20, marginTop: 10, textAlign: 'center' }} />
      </View>

      <View style={{ width: '30%', height: '30%', marginHorizontal: '35%', borderColor: 'black', borderWidth: 3 }}>
        <Image src={`data:image/jpeg;base64,${image64}`} style={{ width: '100%', height: '100%' }} />
      </View>

      <View style={{ borderBottomColor: 'black', borderBottomWidth: 4, marginTop: 10 }}>

      </View>
      <View>
        <TextInput onChangeText={setPostDownload} value={postDownload} placeholder='Enter name of the post you want to download (do not specify mime type)' style={{ fontSize: 20, marginTop: 10, textAlign: 'center' }} />
        <Text style={{ fontSize: 20, marginTop: 10, textAlign: 'center' }}>Photo you downloaded</Text>
      </View>
      <View style={{ width: '30%', height: '30%', marginHorizontal: '35%', borderColor: 'black', borderWidth: 3 }}>
        <Image src={`data:image/jpeg;base64,${imageURL}`} style={{ width: '100%', height: '100%' }} />
      </View> */}

    </View>
  );
}

function Home() {
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
      <Home></Home>
    );
  }

  return (
    // <Profile>

    // </Profile>
    <AppHome />

  );
}
function App() {
  return (
    <NavigationContainer>
      <Main></Main>
      {/* <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen name="Main"
          component={Main} />

        <Stack.Screen name="Home"
          component={Home} />

        <Stack.Screen name="Profile"
          component={Profile} />

        <Stack.Screen name="NewAccount"
          component={NewAccount} />
      </Stack.Navigator> */}
    </NavigationContainer>
  );
}

export default App;