import React, { useCallback, useState, useEffect } from 'react'
import { View, FlatList, Button, TextInput } from 'react-native';
import { auth, firestore } from '../firebase/firebase';
import { doc, collection, getDocs, query, orderBy, setDoc, where, getDoc, limit, collectionGroup, or } from 'firebase/firestore';
import Post from '../components/Post';
import ChatComponent from '../components/ChatComponent';
const ChatMultiple = ({ navigation }) => {
    const [user, setUser] = useState("");
    const [chats, setChats] = useState([

    ]);
    let index = 1;
    const getChats = async () => {
        const userRef = collection(firestore, "chats");
        const query1 = query(userRef, or(where("sentTo", "==", auth.currentUser.email), where("user._id", "==", auth.currentUser.email)));
        const querySnapshot = await getDocs(query1);
        const newChats = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const user = data.user._id;
            const sentTo = data.sentTo;
            if (user == auth.currentUser.email) {
                const res = newChats.filter((chat) => {
                    return chat.user == sentTo;
                });
                if (res.length == 0) {
                    newChats.push({
                        key: index,
                        user: sentTo,
                    })
                    index += 1;
                }
            }
            else {
                const res = newChats.filter((chat) => {
                    return chat.user == user;
                });
                if (res.length == 0) {
                    newChats.push({
                        key: index,
                        user: user,
                    })
                    index += 1;
                }
            }
            // doc.data() is never undefined for query doc snapshots
        });
        setChats(newChats);
        index = 1;
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            getChats();
        });

        return unsubscribe;
    }, [navigation]);


    const renderComponent = ({ item }) => (
        <ChatComponent username={item.user} onPress={() => {
            navigation.navigate("Chat", { username: item.user });
        }} />
    )
    return (
        <View>
            <TextInput onChangeText={(text) => {
                setUser(text);
            }} value={user} placeholder='Email' />
            <Button title='Start' onPress={() => {
                navigation.navigate("Chat", { username: user });
            }} />
            <FlatList
                data={chats}
                renderItem={renderComponent}
                keyExtractor={(item) => item.key}
            />
        </View>

    )
}
export default ChatMultiple