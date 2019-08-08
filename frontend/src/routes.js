import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Login from './pages/Login';
import Main from './pages/Main';

export default function Routes() {
    return (
        <BrowserRouter>
            <Route path="/" exact component={Login}/> {/* Aqui como é a primeira página da aplicação, o path dela é a raiz, por isso apenas a /. O comando exact serve para comparar se a rota é exatamente igual. Sem o exact, ele olha apenas se a rota começa com / o que causaria um bug de nunca chamar a rota /main, pois a duas começam com barra*/}
            <Route path="/dev/:id" component={Main}/>
        </BrowserRouter> /*Tem que colocar o BrowserRouter por volta de todas as rotas e cada página tem que ter uma rota para ela*/
    );
}
