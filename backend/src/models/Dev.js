const { Schema, model } = require('mongoose'); /*Importando dependências do mongoose, por isso as chaves após const*/

const DevSchema = new Schema({
    name: {
        type: String, /*O name terá que ser do tipo string*/
        required: true, /*required: true quer dizer que o name vai ser obrigatório*/
    },
    user: {
        type: String,
        required: true,
    },
    bio: String, /*Nesse caso, bio não é obrigatório. Por isso passamos já o tipo depois dos dois pontos*/
    avatar: {
        type: String,
        required: true,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Dev',
    }], /*Salva os likes que foram dados. Pra isso, ele salva o ID do user que foi dado o like. Esse ID foi criado automaticamente pelo MongoDB e para acessá-lo usa Schema.Types.ObjectID. O ref diz que o objeto que estamos referenciando é um Dev (isso é tipo uma chave estrangeira para acessar a tabela de Dev*/
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'Dev',
    }],
}, {
    timestamps: true, /*Cria duas colunas automáticas para salvar a data de criação de um registro e a data da última atualização.*/
}); /*new Schema está criando o esquema (estrutura) do desenvolvedor que será necessária para armazenar os registros na tabela do meu BD. DevSchema é apenas uma variável que vai contar o Schema criado*/

module.exports = model('Dev', DevSchema); /*Exporta o model que importamos lá no início do arquivo passando como parâmetro o objeto que estamos salvando no DB (no caso, Dev) e o esquema criado aqui.*/