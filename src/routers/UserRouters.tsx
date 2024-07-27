import { UserLayout } from '@/layouts'
import { Account, AddressComponent, ChangePassword, OrderUser } from '@/pages/user'
import { userPath } from '@/utils/constants'

import { ComponentType, ReactNode } from 'react'

const route = (
    path: string,
    component: ComponentType<any>,
    layout?: ComponentType<{ children: ReactNode }>
) => {
    return {
        path: userPath + path,
        component,
        layout: layout ?? UserLayout,
    }
}

const UserRouters = [
    route('/account', Account),
    route('/password', ChangePassword),
    route('/address', AddressComponent),
    route('/order', OrderUser),
]

export default UserRouters
