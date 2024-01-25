import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const num1 = 1;
    const num2 = 2;

    function sum(a: number, b: number) {
        return a + b;
    }

    const fizz = sum(num1, 5);

    return (
        <div className='App'>
            <header className='App-header'>
                <img src={logo} className='App-logo' alt='logo' />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className='App-link'
                    href='https://reactjs.org'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Learn React
                </a>
                {fizz}
            </header>
        </div>
    );
}

export default App;
