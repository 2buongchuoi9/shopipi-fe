import Login from '@/pages/main/auth/Login'
import { Route, Routes, useLocation } from 'react-router-dom'

import ErrorPage from '@/pages/ErrorPage'
import { adminRouters, publicRouters, SecurityRoute, sellerRouters } from '@/routers'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect } from 'react'
import { ProgressProvider } from './contexts/ProgressContext'
import { useAuth, useMessage } from './hooks'
import { UserRoles } from './utils/constants'
import socketService from './socketService'
import { info } from 'console'

NProgress.configure({ showSpinner: false, trickleSpeed: 300 })

const ProgressBar = () => {
    const location = useLocation()

    useEffect(() => {
        NProgress.start()

        NProgress.done()
    }, [location])

    return null
}

function App() {
    const { isAuthenticated, user } = useAuth()
    const { notify } = useMessage()

    useEffect(() => {
        if (isAuthenticated && user.id) {
            const destination = `/user/${user.id}/private`

            socketService.subscribe(
                destination,
                (message) => {
                    notify('info', 'New message', message.message)
                }
                // (e) => setError(e)
            )
        }

        return () => {
            if (isAuthenticated && user.id) {
                socketService.unsubscribe(`/user/${user.id}/private`)
            }
        }
    }, [isAuthenticated, user.id])
    return (
        <>
            <ProgressProvider>
                <ProgressBar />
                <Routes>
                    {publicRouters.map(({ layout: Layout, path, component: Component }, index) => {
                        return (
                            <Route
                                key={index}
                                path={path}
                                element={<Layout>{<Component />}</Layout>}
                            />
                        )
                    })}

                    {sellerRouters.map(({ layout: Layout, path, component: Component }, index) => {
                        return (
                            <Route
                                key={index}
                                path={path}
                                element={
                                    <SecurityRoute
                                        component={Component}
                                        layout={Layout}
                                        path={path}
                                        roles={[UserRoles.Shop]}
                                    />
                                }
                            />
                        )
                    })}

                    {adminRouters.map(({ layout: Layout, path, component: Component }, index) => {
                        return (
                            <Route
                                key={index}
                                path={path}
                                element={
                                    <SecurityRoute
                                        component={Component}
                                        layout={Layout}
                                        path={path}
                                        roles={[UserRoles.ADMIN]}
                                    />
                                }
                            />
                        )
                    })}

                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </ProgressProvider>
        </>
    )
}

export default App
