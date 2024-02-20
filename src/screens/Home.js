import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from './Feed';
import CreatePost from './CreatePost';
import Profile from './Profile';
import Chat from './Chat';
import ChatMultiple from './ChatMultiple';
const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="CreatePost" component={CreatePost} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="ChatMultiple" component={ChatMultiple} />
    </Tab.Navigator>
  );
};

export default Home;
