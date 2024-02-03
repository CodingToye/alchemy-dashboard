import React from 'react';
import Panels from './components/panels';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import './App.css';

function App() {
    const client = new ApolloClient({
        uri: 'http://localhost:5000/graphql',
        cache: new InMemoryCache(),
    });
    return (
        <ApolloProvider client={client}>
            <div className='App'>
                <header className='App-header'>
                    <h1>Alchemy: Personal Dashboard</h1>
                </header>

                <Panels />
            </div>
        </ApolloProvider>
    );
}

export default App;
