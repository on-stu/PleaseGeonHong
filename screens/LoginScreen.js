import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Button, Input, Image } from "react-native-elements";
import { KeyboardAvoidingView, StyleSheet, View, Text } from "react-native";
import { styleSheets } from "min-document";
import { auth } from "../firebase";

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if(authUser) {
                navigation.replace("Home") //replace일 경우 뒤로 가기 버튼이 안생기고 navigate일 땐 생김
            }
        });

        return unsubscribe;
    }, []);

    const signIn = () => {
        auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error));
    }

    return(
        <KeyboardAvoidingView behavior='padding' enabled style={styles.container}>
            <StatusBar style="light" />
            <Image source={{
                uri:"https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png",
            }} 
            style={{ width:200, height:200 }}
            />
            <View style={styles.inputContainer}>
                <Input placeholder="Email" autoFocus type="email" value={email} onChangeText={(text) => setEmail(text)} />
                <Input placeholder="Password" secureTextEntry value={password} onChangeText={(text) => setPassword(text)} type="password" onSubmitEditing={signIn} />
            </View>

            <Button containerStyle={styles.button} title="Login" onPress={signIn}/>
            <Button containerStyle={styles.button} type="outline" title="Register" onPress={()=> navigation.navigate("Register")} />
            <View style={{height:100}} />
        </KeyboardAvoidingView>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor:"white",
    },
    inputContainer: {
        width:300,
    },
    button:{
        width:200,
        marginTop:10,
    },
});