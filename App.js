import React,{useState, useEffect} from 'react';
import {StatusBar, Button, StyleSheet, Text, View} from 'react-native';

import {Audio} from 'expo-av';
import {Gyroscope} from "expo-sensors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    shakeText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'black',
    },
});


export default function App() {

    const [mySound, setMySound] = useState();
    const[{x,y,z},setData] = useState({x:0,y:0,z:0});
    const [isShaking, setIsShaking] = useState(false);

    async function playSound(){
        const soundfile = require('./single Jingle bell.wav');
        const {sound} = await Audio.Sound.createAsync(soundfile);
        setMySound(sound);
        await sound.playAsync();
    }
    useEffect(() => {
        Gyroscope.setUpdateInterval(100);
        const subscription = Gyroscope.addListener((data) => {
            setData(data);
            const movement = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
            if (movement > 1.5 && !isShaking) {
                setIsShaking(true);
                playSound();
            } else if (movement <= 1.5) {
                setIsShaking(false);
            }
        });

        return () => {
            subscription.remove();
            if (mySound) {
                console.log('Unloading Sound');
                mySound.unloadAsync();
            }
        };
    }, [isShaking]);

    return (
        <View style={styles.container}>
            <StatusBar />
            {isShaking && <Text style={styles.shakeText}>SHAKE!</Text>}
        </View>
    );
}


