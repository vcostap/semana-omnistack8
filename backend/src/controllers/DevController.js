const axios = require('axios');/*Importando o pacote axios, que é usado para fazer requisições a APIs externas*/
const Dev = require('../models/Dev'); /*Importando o modelo de dev para armazenar as informações dentro do banco de dados*/


module.exports = {
    async index(req, res){
        const { user } = req.headers; /*Busca o usuário logado de dentro do header*/

        const loggedDev = await Dev.findById(user); /*Pegou todos os dados do usuário que foi passado no header acima*/

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } }, /*$ne = not equal*/
                { _id: { $nin: loggedDev.likes } }, /*$nin = not in, não esteja em uma lista/vetor*/
                { _id: { $nin: loggedDev.dislikes } },
            ], /*$and aplica and em volta dos 3 filtros. Um shortcut para filtro AND filtro AND filtro*/
        }) /*Buscar todos os devs do meu BD que não são o usuário logado, os dislikes dele e os likes. Logo serão necessários 3 filtros*/

        return res.json(users);
    }, /*Método usado para listar vários registros de dentro de uma tabela de um BD*/

    async store(req, res){
        const { username } = req.body; /*Está pegando o username lá do insomnia. Esse username será usado para ir dentro da API do GitHub e buscar os dados do usuário para criar ele no TinDev*/

        const userExists = await Dev.findOne({ user: username }); /*Busca se o usuário username já existe*/

        if (userExists) {
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`); /*Pega a resposta retornada pelo axios da API*//*O axios.get demora um pouco para executar. Então temos que usar o comando await para dizer para o programa continuar apenas quando a linha for executada, evitando assim erro. Se não esperar, ele já vai pra próxima linha e o data não vai existir ainda, pois o axios.get ainda não terminou de executar e criá-lo. Como usamos o await dentro de uma função (no caso, store), devemos dizer que essa função é assíncrona e por isso usamos o async antes do store.*/

        const { name, bio, avatar_url: avatar } = response.data; /*Criando uma desestruturação para pegar os dados que me serão necessários de response.data*//*data é onde vai estar os dados da resposta da requisição*/

        const dev = await Dev.create({ 
            name,
            user: username, 
            bio, 
            avatar
         }); /*Passando as informações para criar um de Dev. Essas informações vem de dentro do data criado pelo axios.get*/

        return res.json(dev); /*O retorno será todos os dados necessários para salvar o desenvolvedor dentro do banco MongoDB*/
    },
};/*Exportar todos os métodos relacionados ao objeto Dev*/