import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import theme from './Theme.js'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      {/* Reset toàn bộ các giá trị mặc định không nhất quán đó về một tiêu chuẩn chung. */}
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </React.StrictMode>
)
