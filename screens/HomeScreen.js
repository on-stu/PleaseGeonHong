import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import CustomListItem from '../components/CustomListItem';
import {AntDesign, SimpleLineIcons} from "@expo/vector-icons";
import {auth, db} from '../firebase';

const HomeScreen = ({navigation}) => {

  const [chats, setChats] = useState([]);

  const signOutUser = () => {
    auth.signOut().then(() =>{
      navigation.replace('Login');
    });
  }

  useEffect(() => {
    const unsubscribe = db.collection("chats").onSnapshot(snapshot => {
      setChats(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      })))
    })

    return unsubscribe;
  }, [])

  useLayoutEffect(() => {
    console.log(auth.currentUser.photoURL);
    navigation.setOptions({
      title: "Signal",
      headerLeft: () => (
        <View style={{marginLeft:20}}>
          <TouchableOpacity onPress={signOutUser}>
            <Avatar rounded source={{uri: auth.currentUser.photoURL}} />
          </TouchableOpacity>
        </View>
      ), // 중괄호 집어넣지 말아라 ㄹㅇ ;;\
      headerRight: () => (
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width : 80,
          marginRight : 20,
        }}>
          <TouchableOpacity>
            <AntDesign name="camerao" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            navigation.navigate("AddChat")
          }}>
            <SimpleLineIcons name="pencil" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )
    });
  },[navigation])

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {id, chatName});
  }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map(({id, data : {chatName}}) => (
                  <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat}/>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
  container:{
    height:"100%",
  }
});