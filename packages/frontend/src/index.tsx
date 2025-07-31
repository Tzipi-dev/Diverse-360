import React from 'react';
import ReactDOM from 'react-dom/client';
//  import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './app/store';
import './globalComponents/ui/global.css';
import HostagesTickerEmbed from './features/HostagesTickerEmbed';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './globalComponents/ui/muiTheme'; // כמו בקובץ App.tsx


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
  
);

root.render(

  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter> 
      <HostagesTickerEmbed/>
      <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();