import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import AuthProvider from './contexts/AuthContext.tsx'
import CategoryProvider from './contexts/CategoryContex.tsx'
import LoadingProvider from './contexts/LoadingContext.tsx'
import MessageProvider from './contexts/MessageContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <LoadingProvider>
                <AuthProvider>
                    <CategoryProvider>
                        <MessageProvider>
                            <App />
                        </MessageProvider>
                    </CategoryProvider>
                </AuthProvider>
            </LoadingProvider>
        </BrowserRouter>
    </StrictMode>
)
