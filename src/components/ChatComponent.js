import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ChatComponent = ({ username, onPress }) => {
    return (
        <TouchableOpacity style={styles.postContainer} onPress={onPress}>
            <View style={styles.headerContainer}>
                <Image source={{ uri: 'https://www.deviantart.com/davidsdinos/art/Toothless-from-How-to-Train-Your-Dragon-Png-968604739' }} style={styles.profileImage} />
                <Text style={styles.username}>{username}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#FFF', // Replace with the color you need
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e1e8ed', // Replace with the color you need
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 25,
        height: 25,
        borderRadius: 20,
        marginRight: 10,
        padding: 10,
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    content: {
        fontSize: 14,
        marginTop: 4,
        lineHeight: 20,
    },
});

export default ChatComponent;