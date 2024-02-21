import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { auth } from '../firebase/firebase';

const Profile = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Button title='Sign Out' onPress={async () => {
        await auth.signOut().then(() => {
          Alert.alert("Signed out!");
          navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        });
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
