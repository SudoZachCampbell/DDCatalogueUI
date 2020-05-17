import React from 'react';
import {useState} from 'react';
import { Route } from 'react-router';
import Layout from './layouts/Layout';
import Home from './pages/Home'
import NpcList from './pages/NpcList';
import 'typeface-roboto'

import './custom.css'
import NpcDetails from './pages/NpcDetails';

export default function App(props) {
    const [pageName, setPageName] = useState('');

    return (
        <Layout pageName={pageName}>
            <Route exact path='/' render={(props) => <Home setPageName={setPageName} />} />
            <Route path='/npcs' render={(props) => <NpcList setPageName={setPageName} />} />
            <Route path='/npc-details/:id' render={(props) => <NpcDetails setPageName={setPageName} />} />
        </Layout>
    );
}
