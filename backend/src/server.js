const express = require('express'); /*Importando o express. Para isso usa a sintaxe require*/
const mongoose = require('mongoose'); /*Importando o mongoose. Obs: importe antes de importar as rotas*/
const cors = require('cors'); /*Importando o cors*/

const routes = require('./routes'); /*Importando as rotas. A forma de importar é diferente porque é um arquivo que nós criamos e não um módulo já existente*/

const server = express(); /*Criando o novo servidor do express*/

mongoose.connect('mongodb+srv://vcostap:briGADEIRO29@cluster0-chgz4.mongodb.net/omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true 
}); /*Faz a conexão com o BD. A string passada como parâmetro é a string gerada quando o banco é configurado. Lembre-se de trocar o usuário e senha na url passada para a que você setou ao configurar o BD. Troque também o test para o nome do banco de dados. Se o banco não existir, ele cria sozinho. Depois de passar a url, acrescente o parâmetro que está ali para sumir com o DeprecationWarning que irá aparecer caso você não o passe*/

server.use(cors()); /*Tem que chamar antes das rotas. Isso é importante. Ele é uma função*/
server.use(express.json()); /*Avisando ao express que vamos trabalhar com objetos JSON*/
server.use(routes); /*Usa as rotas importadas*/

server.listen(3333); /*Fala qual porta o servidor criado acima irá ouvir. Nesse caso, irá ouvir a porta 3333*/