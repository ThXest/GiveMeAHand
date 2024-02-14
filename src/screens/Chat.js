import { auth } from '../firebase/firebase'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])
  useLayoutEffect(() => {
    const unsubscribe = db.collection('chats').orderBy('createdAt', 'desc').onSnapshot(snapshot => setMessages(
    snapshot.docs.map(doc => ({
    _id: doc.data()._id,
    createdAt: doc.data().createdAt.toDate(),
    text: doc.data().text,
    user: doc.data().user,
    }))
    ));
    return unsubscribe;
    }, [])
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const{
      _id,
      createdAt,
      text,
      user

    } = messages[0]
    db.collection('chats').add({
      _id,
      createdAt,
      text,
      user
      })
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
  export default Chat