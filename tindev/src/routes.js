import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import Login from './pages/Login';
import Main from './pages/Main';

export default createAppContainer(
    createSwitchNavigator({
        Login,
        Main,
    })
); /*Criando a rota de navegação das páginas. Está na ordem. Primeiro vai ser a Login, depois a Main */