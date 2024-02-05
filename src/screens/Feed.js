import React from 'react';
import { View, FlatList, Button, StyleSheet } from 'react-native';
import Post from '../components/Post';
import { firestore } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Add navigation as a prop to the Feed component
const Feed = ({ navigation }) => {

  const getFromFirestore = async () => {
    const docRef = doc(firestore, "posts", "post1");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().uid);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  }
  getFromFirestore();
  // Dummy data array for posts
  const posts = [
    { id: '1', username: 'emredinc', content: 'Added Post and CreatePost Components to share posts' },
    { id: '2', username: 'emredinc10', content: 'Fenerin maçı var!!!' },
  ];

  // Render each post using FlatList for better performance with lists
  const renderPost = ({ item }) => (
    <Post username={item.username} content={item.content} />
  );

  return (
    <View style={styles.container} >
      {/* FlatList for rendering posts */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
      />
      {/* Button to navigate to CreatePost screen */}
      <Button
        title="Create New Post"
        onPress={() => navigation.navigate('CreatePost')}
      />
    </View>
  );
};

// Add styles for the container
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up all available space
  },
});

export default Feed;
