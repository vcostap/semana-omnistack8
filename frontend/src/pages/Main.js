import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.svg'; /*Importando a logo. Lembre-se que ela se torna uma variável JS*/
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ match }) {
    const [users, setUsers] = useState([]); /*Aqui inicializou com um array vazio porque essa variável irá guardar vários devs que serão mostrados pro usuário que acessar o app*/
    const [matchDev, setMatchDev] = useState(null);/*Variável pra guardar o estado de quando der um match*/

    useEffect(() => {
        async function loadUsers(){
            const response = await api.get('/devs', {
                headers: { 
                    user: match.params.id, 
                }
            })

            setUsers(response.data);
        }

        loadUsers();
    }, [match.params.id]); /*Toda vez que o id da url for alterado, a função passada como parâmetro será chamada novamente. Aqui acontece a chamada a API*/

    useEffect(() => {
        const socket = io('http://localhost:3333', {
          query: { user: match.params.id }  /*Enviando o id da conexão do usuário que está conectando pro back end */
        }); /*Conectando ao back end*/

        socket.on('match', dev => {
            setMatchDev(dev); /*Faz com que o matchDev seja um objeto contendo todas as informções do dev com o qual você deu match*/
        })
    }, [match.params.id]); /*Aqui vai conectar o front end ao websocket*/
    
    async function handleLike(id) {
        await api.post(`/devs/${id}/likes`, null, {
            headers: { user: match.params.id },
        }) 

        setUsers(users.filter (user => user._id !== id));
    }

    async function handleDislike(id) {
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: { user: match.params.id },
        }) /*Manda o dev que eu dei dislike pra minha lista de dislikes*/

        setUsers(users.filter (user => user._id !== id)); /*Remove o dev que dei dislike da lista de users, aí ele não vai aparecer mais na minha página*/
    }

    return (
        <div className="main-container">
            <Link to="/"> {/* Volta pra rota que você passar dentro do to. No nosso caso, / volta pra página de login. */}
                <img src={logo} alt="Tindev"/>
            </Link>

            { users.length > 0 ? (
                <ul>
                {users.map(user => (
                    <li key={useEffect._id}>
                        <img src={user.avatar} alt={user.name}/>
                        <footer>
                            <strong>{user.name}</strong>
                            <p>{user.bio}</p>
                        </footer>

                        <div className="buttons">
                            <button type="button" onClick={() => handleDislike(user._id)}>
                                <img src={dislike} alt="Dislike"/>
                            </button>
                            <button type="button" onClick={() => handleLike(user._id)}>
                                <img src={like} alt="Like"/>
                            </button>
                        </div>
                    </li>
                ))} {/* users.map serve pra gente percorrer a array users */}
            </ul>
            ) : (
                <div className="empty">Acabaram-se os devs! ='(</div>
            )}

            {matchDev && (
                <div className="match-container">
                    <img src={itsamatch} alt="It´s a match"/>

                    <img className='avatar' src={matchDev.avatar} alt="Avatar"/>
                    <strong>{matchDev.name}</strong>
                    <p>{matchDev.bio}</p>

                    <button type='button' onClick={() => setMatchDev(null)}>FECHAR</button>
                </div>
            )}
        </div>
    );
}

/* match.params.id -> Isso vai pegar o parâmetro que foi passado na rota, no caso id. O nome id vem do arquivo routes.js e é o nome do parâmetro que demos para a rota do componente Main.js */