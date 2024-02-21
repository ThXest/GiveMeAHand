import { auth } from '../firebase/firebase'
import React, { useCallback, useLayoutEffect, useState, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { firestore } from '../firebase/firebase';
import { doc, getDoc, collection, getDocs, query, orderBy, limit, setDoc, addDoc, where, or, and } from 'firebase/firestore';
import { Text, View } from 'react-native';
const Chat = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);

  const getChats = async () => {
    const messagesRef = collection(firestore, "chats");
    console.log(route.params.username);
    const query1 = query(messagesRef, or(and(where("sentTo", "==", auth.currentUser.email), where("user._id", "==", route.params.username)), and(where("sentTo", "==", route.params.username), where("user._id", "==", auth.currentUser.email))), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(query1);
    const newMessages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const _id = data._id;
      const createdAt = data.createdAt.toDate();
      const text = data.text;
      const user = data.user;
      const sentTo = data.sentTo;
      // doc.data() is never undefined for query doc snapshots
      newMessages.push({
        _id: _id,
        createdAt: createdAt,
        sentTo: sentTo,
        text: text,
        user: user,
      });
      console.log("2");
    });
    setMessages(newMessages);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getChats();
    });

    return unsubscribe;
  }, [navigation]);
  /* useLayoutEffect(() => {

    
     const unsubscribe = firestore.collection('chats').orderBy('createdAt', 'desc').onSnapshot(snapshot => setMessages(
      snapshot.docs.map(doc => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      }))
    )); 
    return unsubscribe;
  }, []) */
  const onSend = useCallback(async (messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const {
      _id,
      createdAt,
      text,
      user

    } = messages[0]
    await addDoc(collection(firestore, "chats"), {
      _id: _id,
      createdAt: createdAt,
      text: text,
      sentTo: route.params.username,
      user: user,
    });
  }, [])

  return (

    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth?.currentUser?.email,
        name: auth?.currentUser?.displayName,
        avatar: auth?.currentUser?.photoURL
      }}
    />


  )
}
export default Chat