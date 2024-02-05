import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, FlatList, Button, StyleSheet } from 'react-native';
import Post from '../components/Post';
import { firestore } from '../firebase/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

// Add navigation as a prop to the Feed component
const Feed = ({ navigation }) => {

  // Dummy data array for posts
  const [posts, setPosts] = useState([]);
  let number = 1;
  const getFromFirestore = async () => {
    const querySnapshot = await getDocs(collection(firestore, "posts"));
    const newPosts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const id = data.uid;
      const content = data.text_content;
      console.log(content);
      // doc.data() is never undefined for query doc snapshots
      newPosts.push({
        id: `${number}`,
        username: `${id}`,
        content: content,
      });
      number = number + 1;
    });
    setPosts(newPosts);
  }

  useEffect(() => {
    getFromFirestore();
  }, []);

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
