import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { GetDataProvider } from './context/GetDataContext.jsx'
import { ToastContainer } from 'react-toastify';
import { OpenLeadProvider } from './context/OpenLeadContext.jsx'
import { GetDocProvider } from './context/GetDocument.jsx'
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <GetDataProvider>
      <OpenLeadProvider>
        <GetDocProvider>
          <App />
        </GetDocProvider>
      </OpenLeadProvider>
    </GetDataProvider>
    <ToastContainer />
  </AuthProvider>
)
