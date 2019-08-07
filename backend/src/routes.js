const express = require('express'); /*Importando o express*/

const DevController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController'); /*Importando o controller*/
const DislikeController = require('./controllers/DislikeController'); /*Importando o controller*/

const routes = express.Router(); /*Cria um objeto específico para rotas*/

routes.get('/devs', DevController.index); /*DevController.index função criada dentro do DevController.js. Essa rota será para listar os desenvolvedores*/
routes.post('/devs', DevController.store);/*POST usado para criar um objeto*//*DevController.store é a função que foi criada dentro do DevController.js*/
routes.post('/devs/:devId/likes', LikeController.store);/*Rota dos likes*/
routes.post('/devs/:devId/dislikes', DislikeController.store);/*Rota dos dislikes*/

module.exports = routes; /*Exporta as rotas para ficarem visíveis para o server.js*/