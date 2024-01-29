import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const CreatePost = ({ navigation }) => {
  const [content, setContent] = useState('');

  const sharePost = () => {
    // Here you would handle the post-sharing logic, e.g., send the content to the backend
    // For now, we will just print the content to the console
    console.log(content);

    // After sharing the post, we navigate back to the Feed
    navigation.goBack();
  };

  return (
    <View>
      <TextInput
        multiline
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
      />
      <Button title="Share Post" onPress={sharePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  share: {
    height: 50,
    width: 50,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 60,
  },
});

export default CreatePost;
