import React, { useCallback, useState, useEffect } from 'react'
import { View, FlatList, Button, TextInput } from 'react-native';
import { firestore } from '../firebase/firebase';
import { doc, collection, getDocs, query, orderBy, setDoc } from 'firebase/firestore';
import Post from '../components/Post';
import ChatComponent from '../components/ChatComponent';
const ChatMultiple = ({ navigation }) => {
    const [user, setUser] = useState("");
    const [chats, setChats] = useState([]);

    const getChats = async () => {
        const chatsRef = collection(firestore, "chats");
        const q = query(chatsRef, orderBy('chatStartTime', 'desc'));
        const querySnapshot = await getDocs(q);
        const newChats = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const chatStartTime = data.chatStartTime.toDate();
            const messages = data.messages;
            const newMessages = [];
            const user = data.user;
            // doc.data() is never undefined for query doc snapshots
            newChats.push({
                user: user,
                chatStartTime: chatStartTime,
                messages: newMessages,
            });

        });
        setChats(newChats);
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            getChats();
        });

        return unsubscribe;
    }, [navigation]);
    const onSend = useCallback(async (user1) => {
        await setDoc(doc(firestore, "chats", user1.toString()), {
            user: {
                //id: _id,
                name: user1,
                //avatar: avatar,
            },
            chatStartTime: new Date(),
            messages: {
                message1: {
                    _id: 1,
                    text: 'Hello',
                    createdAt: new Date(),
                    sentBy: 0
                },
                message2: {
                    _id: 2,
                    text: 'Hi',
                    createdAt: new Date(),
                    sentBy: 1
                },
            }
        });
    }, [])

    const renderComponent = ({ item }) => (
        <ChatComponent username={item.user.name} onPress={() => {
            navigation.navigate("Chat", { username: item.user.name });
        }} />
    )
    return (
        <View>
            <TextInput onChangeText={(text) => {
                setUser(text);
            }} value={user} placeholder='Email' />
            <Button title='Start' onPress={() => {
                onSend(user)
            }} />
            <FlatList
                data={chats}
                renderItem={renderComponent}
                keyExtractor={(item) => item.user.name}
            />
        </View>

    )
}
export default ChatMultiple