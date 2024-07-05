import { AdminLayout } from '@/layouts'
import Redirect from '@/pages/Redirect'
import { ComponentType, ReactNode } from 'react'

const route = (
    path: string,
    component: ComponentType<any>,
    layout?: ComponentType<{ children: ReactNode }>
) => {
    return {
        path,
        component,
        layout: layout ?? AdminLayout,
    }
}

const publicRouters = [route('/login-redirect', Redirect)]

export default publicRouters
