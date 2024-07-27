import Login from '@/pages/main/auth/Login'
import { Route, Routes, useLocation } from 'react-router-dom'

import ErrorPage from '@/pages/ErrorPage'
import { adminRouters, publicRouters, SecurityRoute, sellerRouters, userRouters } from '@/routers'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect, useState } from 'react'
import { ProgressProvider } from './contexts/ProgressContext'
import { useAuth, useMessage } from './hooks'
import { UserRoles } from './utils/constants'
import socketService from './socketService'
import { info } from 'console'
import { Badge, Button } from 'antd'
import ChatComponent from './components/chat/ChatComponent'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { ChatProvider } from './contexts/ChatContext'
import useChat from './hooks/useChat'

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
    const { notify, error } = useMessage()
    const { count, setCount, visible, setVisible } = useChat()

    useEffect(() => {
        let pingInterval: NodeJS.Timeout | undefined

        const updateOnlineStatus = (status: 'online' | 'offline') => {
            if (isAuthenticated && user.id) {
                socketService.pingUser(user.id, status)
            }
        }

        if (isAuthenticated && user.id) {
            const destination = `/user/${user.id}/private`

            socketService.subscribe(destination, (message) => {
                setCount((prev) => prev + 1)
                notify('info', 'New message', message.message)
            })

            updateOnlineStatus('online')

            pingInterval = setInterval(() => {
                updateOnlineStatus('online')
            }, 60000) // 60000 ms = 60 giây

            window.addEventListener('offline', () => updateOnlineStatus('offline'))
            window.addEventListener('online', () => updateOnlineStatus('online'))
            window.addEventListener('beforeunload', () => updateOnlineStatus('online'))
        }

        return () => {
            if (isAuthenticated && user.id) {
                socketService.unsubscribe(`/user/${user.id}/private`)

                updateOnlineStatus('offline')

                if (pingInterval) clearInterval(pingInterval)

                window.removeEventListener('offline', () => updateOnlineStatus('offline'))
                window.removeEventListener('online', () => updateOnlineStatus('online'))
                window.removeEventListener('beforeunload', () => updateOnlineStatus('offline'))
            }
        }
    }, [isAuthenticated, user.id])

    return (
        <>
            <ProgressProvider>
                <ProgressBar />
                <Routes>
                    {publicRouters.map(({ layout: Layout, path, component: Component }, index) => (
                        <Route key={index} path={path} element={<Layout>{<Component />}</Layout>} />
                    ))}

                    {userRouters.map(({ layout: Layout, path, component: Component }, index) => (
                        <Route
                            key={index}
                            path={path}
                            element={
                                <SecurityRoute
                                    component={Component}
                                    layout={Layout}
                                    path={path}
                                    roles={[UserRoles.USER]}
                                />
                            }
                        />
                    ))}

                    {sellerRouters.map(({ layout: Layout, path, component: Component }, index) => (
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
                    ))}

                    {adminRouters.map(({ layout: Layout, path, component: Component }, index) => (
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
                    ))}

                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>

                <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
                    <Badge count={count}>
                        <Button
                            type="primary"
                            shape="circle"
                            size="large"
                            style={{ width: 50, height: 50 }}
                            onClick={() => {
                                if (!isAuthenticated) {
                                    error('Hãy đăng nhập để sử dụng chức năng này')
                                    return
                                }
                                setVisible(!visible)
                                setCount(0)
                            }}
                            icon={<IoChatbubbleEllipsesOutline />}
                        />
                    </Badge>
                    <ChatComponent
                        className={visible ? 'block' : 'invisible'}
                        style={{ position: 'fixed', bottom: 20, right: 70, zIndex: 1000 }}
                    />
                </div>
            </ProgressProvider>
        </>
    )
}

export default App
