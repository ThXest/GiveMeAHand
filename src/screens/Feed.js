import React from 'react';
import { View, FlatList, Button, StyleSheet } from 'react-native';
import Post from '../components/Post';

// Add navigation as a prop to the Feed component
const Feed = ({ navigation }) => {
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
