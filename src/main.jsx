import CssBaseline from '@mui/material/CssBaseline'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import theme from '~/theme.js'

// Custom dialog Mui
import { ConfirmProvider } from 'material-ui-confirm'


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    {/* Reset toàn bộ các giá trị mặc định không nhất quán đó về một tiêu chuẩn chung. */}
    <ConfirmProvider defaultOptions={{
      allowClose: false,
      dialogProps: { maxWidth: 'xs' },
      cancellationButtonProps: { color: 'inherit' },
      confirmationButtonProps: { color: 'secondary', variant: 'outlined' }
    }}>
      <CssBaseline />
      <App />
      <ToastContainer theme="colored"
        position="bottom-left"
      />
    </ConfirmProvider>
  </CssVarsProvider>
  // </React.StrictMode>
)
