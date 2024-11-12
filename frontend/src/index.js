import React from 'react';
import ReactDOM from 'react-dom/client';  // For React 18+ use 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'; // Import ChakraProvider
import App from './App';  // Import the main App component
import './index.css';  // Import your global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <App /> {/* Your main application */}
    </ChakraProvider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
