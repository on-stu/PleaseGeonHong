import React, { useRef, useLayoutEffect, useState } from 'react'
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native'
import {AntDesign, SimpleLineIcons, Ionicons} from "@expo/vector-icons";
import { Avatar } from 'react-native-elements';
import { auth, db, firestoreInstance } from '../firebase';

const ChatScreen = ({navigation, route}) => {

    const [messages, setMessages] = useState([]);

    const [input, setInput] = useState("");

    const sendMessage = () => {
        Keyboard.dismiss();

        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firestoreInstance.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        })

        setInput("");
    }

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').doc(route.params.id).collection('messages').orderBy('timestamp', 'asc').onSnapshot((snapshot) => setMessages(
            snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            }))
        ))
        return unsubscribe;
    },[route])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle : () => (
                <View>
                    <Text style={{color:"white", marginLeft:10, fontWeight:"700"}}>{route.params.chatName}</Text>
                </View>
            ),

            headerLeft : () => (
                <TouchableOpacity style={{ marginLeft:10 }} onPress={navigation.goBack} >
                    <AntDesign name="arrowleft" size={24} color="white" />
                </TouchableOpacity>
            )
        })
    },[])
    const scrollViewRef = useRef();
    return (
        <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
            <StatusBar style="light" />
            <KeyboardAvoidingView style={styles.container}>
                <ScrollView 
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
                    {messages.map(({id, data}) => (
                        data.email === auth.currentUser.email ? (
                            <View key={id} style={styles.receiver}>
                                <Avatar 
                                    position="absolute"
                                    containerStyle={{
                                        position: "absolute",
                                        bottom: -15,
                                        right:-5
                                    }}
                                    rounded
                                    bottom={-15}
                                    right={-5}
                                    size={30}
                                    source={{
                                        uri: data.photoURL,
                                    }}
                                />
                                <Text style={styles.receiverText}>{data.message}</Text>
                            </View>
                        ) : (
                            <View key={id} style={styles.sender}>
                                <Avatar 
                                    position="absolute"
                                    containerStyle={{
                                        position: "absolute",
                                        bottom: -15,
                                        left:-5
                                    }}
                                    rounded
                                    bottom={-15}
                                    left={-5}
                                    size={30}
                                    source={{
                                        uri: data.photoURL,
                                    }}
                                />
                                <Text style={styles.senderText}>{data.message}</Text>
                                <Text style={styles.senderName}>{data.displayName}</Text>
                            </View>
                        )
                    ))}
                </ScrollView>
                <View style={styles.footer}>
                    <TextInput placeholder="메세지" 
                    style={styles.textInput} value={input} 
                    onSubmitEditing={sendMessage}
                    onChangeText={(text) => setInput(text)} />
                    <TouchableOpacity onPress={sendMessage}>
                        <Ionicons name="send" size={24} color="#2B68E6" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    receiver: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-end",
        borderRadius: 20,
        marginRight: 15,
        marginBottom:20,
        maxWidth: "80%",
        position: "relative",
    },
    sender:{
        padding: 15,
        backgroundColor: "#2B68E6",
        alignSelf: "flex-start",
        borderRadius: 20,
        margin: 15,
        maxWidth: "80%",
        position: "relative",
    },
    senderName: {
        left:15,
        paddingRight:10,
        fontSize: 10,
        color: "white",
    },
    senderText: {
        color:"white",
        fontWeight:"500",
        marginLeft: 10,
        marginBottom: 15,
    },
    footer : {
        flexDirection: "row",
        alignItems: 'center',
        width: "100%",
        padding: 15, 
    },
    textInput : {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        borderColor:"transparent",
        padding: 10,
        color: "grey",
        borderRadius: 30,
    }
})
