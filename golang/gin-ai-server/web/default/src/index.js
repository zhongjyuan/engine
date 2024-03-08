import React from 'react';
import ReactDOM from 'react-dom/client';
import { Container } from 'semantic-ui-react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { UserProvider } from './context/User';
import { StatusProvider } from './context/Status';

import App from './App';
import Header from './components/Header';
import Footer from './components/Footer';

import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StatusProvider>
      <UserProvider>
        <BrowserRouter>
          <Header />
          <Container className={'main-content'}>
            <App />
          </Container>
          <ToastContainer />
          <Footer />
        </BrowserRouter>
      </UserProvider>
    </StatusProvider>
  </React.StrictMode>
);
