import { auth } from '../firebase/firebase'
import React, { useCallback, useLayoutEffect, useState, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { firestore } from '../firebase/firebase';
import { doc, getDoc, collection, getDocs, query, orderBy, limit, setDoc } from 'firebase/firestore';
import { Text, View } from 'react-native';
const Chat = ({ navigation, route }) => {
  const [messages, setMessages] = useState([{
    _id: 1,
    text: 'Hello',
    createdAt: new Date(),
    user: {
      _id: 2,
      name: 'React Native',
      avatar: 'https://placeimg.com/140/140/any',
    },
  }]);

  const getChats = async () => {
    const chatsRef = collection(firestore, "chats");
    const q = query(chatsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const newMessages = [...messages];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const _id = data._id;
      const createdAt = data.createdAt.toDate();
      const text = data.text;
      const user = data.user;

      // doc.data() is never undefined for query doc snapshots
      newMessages.push({
        _id: _id,
        createdAt: createdAt,
        text: text,
        user: user,
      });
      setMessages(newMessages);
    });
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
    await setDoc(doc(firestore, "chats", _id), {
      _id: _id,
      createdAt: createdAt,
      text: text,
      user: user,
    });
  }, [])

  return (

    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
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