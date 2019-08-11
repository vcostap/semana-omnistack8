const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {
        console.log(req.io, req.connectedUsers);

        const { devId } = req.params; /*req.params é usado para pegar um parâmetro que vem dentro da requisição*/
        const { user } = req.headers; /*req.headers tá pegando o valor de user que eu coloquei no header da rota like que foi criado no insomnia*/

        const loggedDev = await Dev.findById(user); /*Vai buscar o model do usuário logado no banco de dados, ou seja, todas as informações a respeito dele que estão salvas lá*//*loggedDev é que dá o like*/
        const targetDev = await Dev.findById(devId); /*Vai buscar o model do alvo do usuário logado no banco de dados, ou seja, todas as informações a respeito dele que estão salvas lá*//*targetDev é que recebe o like*/

        if (!targetDev) {
            return res.status(400).json({ error: 'Dev does not exist!' });
        } /*Verifica se o usuário que estou querendo dar like existe*/

        if (targetDev.likes.includes(loggedDev._id)) {
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if (loggedSocket){
                req.io.to(loggedSocket).emit('match', targetDev);
            } /*Avisa ao usuário logado que ele deu um match e em quem ele deu match, no caso o targetDev */

            if (targetSocket){
                req.io.to(targetSocket).emit('match', loggedDev);
            }
        } /*Verificando se o like é recíproco, ou seja, rolou match*/

        loggedDev.likes.push(targetDev._id) /*Adiciona informação nova dentro de um array e o likes é um array. targetDev._id pega o id do targetDev. Porém isso não altera meu banco de dados*/

        await loggedDev.save(); /*Salva as informações que foram alteradas na linha acima*/

        return res.json(loggedDev);
    }
};