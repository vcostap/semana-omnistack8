import React, {useState} from 'react';
import './Login.css';

import api from '../services/api';

import logo from '../assets/logo.svg'; /*Importando a logo. Lembre-se que ela se torna uma variável JS*/

export default function Login({ history }) {
    const [username, setUsername] = useState(''); /*Aqui você inicia uma variável para conter o estado da informação que você quer manipular e a inicia com algum valor, nesse caso, valor vazio. useState retorna dois valores para a variável. O estado e uma função para setar o estado. Toda vez que for preciso modificar o valor de username, a gente chama a função setUsername*/

    async function handleSubmit(e) {
        e.preventDefault(); /*Não vai deixar o form ter seu comportamento padrão, ou seja, ir para outra página*/

        const response = await api.post('/devs', {
            username, /*username mesmo que username: username, pois o campo username será preenchido pela variável username que foi declarada ali em cima*/
        }); /*Usou api.post porque o método de cadastrar usuário é metodo post. Passou apenas /devs porque o início do caminho já está salvo no arquivo api.js na variável baseURL. Pra isso que ela é utilizada lá*/

        const { _id } = response.data;

        history.push(`/dev/${_id}`); /*Faz com que após o usuário dar um submit no form, ele navegue para a rota /main, que é a outra página da nossa aplicação*/
    }/*Essa função será disparada quando o usuário der um submit no form, ou seja, entrar com algum valor na caixa de texto da página login*/

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}> {/*onSubmit é um parâmetro do form que chama alguma coisa quando o usuário submeter alguma coisa pro form. No caso estamos chamando a função handleSubmit*/}
                <img src={logo} alt="Tindev"/> {/* Em HTML quando passamos uma tag img, temos que passar o src dela como uma string. Porém, queremos passar uma variável JS no lugar dessa string e é por isso que usamos {} e colocamos logo dentro delas. Sempre que tivermos chaves dentro de uma tag HTML, o que está dentro das chaves é sintaxe JS */}
                <input 
                    placeholder="Digite seu usuário no GitHub"
                    value={username} /*username é a variável que eu peguei ali em cima que contém o estado do componente*/
                    onChange={e => setUsername(e.target.value)} /*onChance ele retorna uma evento. Então o e é uma função que recebe esse evento e e.target.value é o valor que foi digitado dentro do input. Então temos que alterar o estado do componente para o valor digitado. Aí usamos o setUsername e passamos o valor novo pra ele, no caso e.targe.valeu*/
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}
