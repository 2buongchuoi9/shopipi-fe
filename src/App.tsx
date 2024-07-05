import Login from '@/pages/Login'
import { Route, Routes } from 'react-router-dom'

import ErrorPage from '@/pages/ErrorPage'
import { privateRouters } from '@/routers'
import publicRouters from './routers/publicRouters'

function App() {
    return (
        <>
            <Routes>
                {publicRouters.map(({ layout: Layout, path, component: Component }, index) => {
                    return (
                        <Route key={index} path={path} element={<Layout>{<Component />}</Layout>} />
                    )
                })}

                {privateRouters.map(({ layout: Layout, path, component: Component }, index) => {
                    return (
                        <Route key={index} path={path} element={<Layout>{<Component />}</Layout>} />
                    )
                })}
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </>
    )
}

export default App
