import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from '../App';
import Logs from "./Logs";

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={App} />
            <Route path='/logs' component={Logs} />
        </Switch>
    </BrowserRouter>
);

export default Router;