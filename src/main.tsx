import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import MessageProvider from './contexts/MessageContext.tsx'
import AuthProvider from './contexts/AuthContex.tsx'
import { StrictMode } from 'react'
import CategoryProvider from './contexts/CategoryContex.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CategoryProvider>
                    <MessageProvider>
                        <App />
                    </MessageProvider>
                </CategoryProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
)
