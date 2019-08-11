import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import { View, SafeAreaView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import api from '../services/api';

import logo from '../assets/logo.png';
import like from '../assets/like.png';
import dislike from '../assets/dislike.png';
import itsamatch from '../assets/itsamatch.png'

export default function Main({ navigation }){
    const id = navigation.getParam('user');
    const [users, setUsers] = useState([]); /*Aqui inicializou com um array vazio porque essa variável irá guardar vários devs que serão mostrados pro usuário que acessar o app*/
    const [matchDev, setMatchDev] = useState(null);/*Variável pra guardar o estado de quando der um match*/

    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/devs', {
                headers: { 
                    user: id, 
                }
            })

            setUsers(response.data);
        }

        loadUsers();
    }, [id]); /*Toda vez que o id da url for alterado, a função passada como parâmetro será chamada novamente*/

    useEffect(() => {
        const socket = io('http://localhost:3333', {
          query: { user: id }  /*Enviando o id da conexão do usuário que está conectando pro back end */
        }); /*Conectando ao back end*/

        socket.on('match', dev => {
            setMatchDev(dev); /*Faz com que o matchDev seja um objeto contendo todas as informções do dev com o qual você deu match*/
        })
    }, [id]); /*Aqui vai conectar o front end ao websocket*/
    
    async function handleLike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id },
        }) 

        setUsers(rest);
    }

    async function handleDislike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id },
        }) /*Manda o dev que eu dei dislike pra minha lista de dislikes*/

        setUsers(rest); /*Remove o dev que dei dislike da lista de users, aí ele não vai aparecer mais na minha página*/
    }

    async function handleLogout() {
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }

    return(
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image source={logo} style={styles.logo}/>
            </TouchableOpacity>

            <View style={styles.cardsContainer}>
                { users.length === 0
                ? <Text style={styles.empty}>Acabaram-se os devs ='(</Text>
                : (
                    users.map((user, index) => (
                        <View key={user._id} style={[styles.card, {zIndex: users.length - index}]}>
                            <Image style={styles.avatar} source={{ uri: user.avatar }}/>
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                    ))
                )}
            </View>

            {users.length > 0 && (
                <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.button} onPress={handleDislike}>
                    <Image source={dislike} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLike}>
                    <Image source={like} />
                </TouchableOpacity>
            </View>
            )}

            { matchDev && (
                <View style={styles.matchContainer}>
                    <Image source={itsamatch} style={styles.matchImage} />
                    <Image source={{ uri: matchDev.avatar }} style={styles.matchAvatar} />

                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>

                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            ) }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    logo: {
        marginTop: 30,
    },
    
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    avatar: {
       flex: 1,
       height: 300,
    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    button: {
        zIndex: 1,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        textShadowOffset: {
            width: 0,
            height: 2,
        },
    },
    empty: {
        alignSelf: 'center',
        fontSize: 24,
        color: '#999',
        fontWeight: 'bold',
    },
    matchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    matchImage: {
        height: 60,
        resizeMode: 'contain',
    },
    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30,
    },
    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },
    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    closeMatch: {
        marginTop: 30,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});