import React from 'react';
import Panels from './features/Panels/Panels';
import Toolbar from './features/Toolbar/Toolbar';
import Filters from './features/Filters/Filters';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import './App.css';

function App() {
    const client = new ApolloClient({
        uri: 'http://localhost:5000/graphql',
        cache: new InMemoryCache(),
    });
    return (
        <ApolloProvider client={client}>
            <div className='App bg-charcoal text-white h-screen'>
                <Toolbar />
                <Filters />
                <Panels />
            </div>
        </ApolloProvider>
    );
}

export default App;
