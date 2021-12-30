import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { db } from '../firebase'

const AddChatScreen = ( {navigation} ) => {

    const createChat = () => {
        db.collection("chats").add({
            chatName: input
        }).then(() => {
            navigation.goBack();
        }).catch((error) => alert(error));
    }

    const [input, setInput] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            title:"새 채팅방 만들기"
        })
    },[navigation])

    return (
        <View style={styles.container}>
            <Input placeholder="채팅방 이름" value={input} onSubmitEditing={createChat} onChangeText={(text) => setInput(text)} />
            <Button disabled={!input} title="채팅방 만들기" onPress={createChat}/>
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding:30,
        height:"100%",
    }
})
