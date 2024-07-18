import { useAuth } from '@/hooks'
import { Role } from '@/http'
import ErrorPage from '@/pages/ErrorPage'

type Props = {
    component: React.ComponentType<any>
    path: string
    layout: React.ComponentType<{ children: React.ReactNode }>
    roles: string[]
}

const SecurityRoute = ({ component: Component, path, layout: Layout, roles, ...rest }: Props) => {
    const { user, isAuthenticated } = useAuth()

    const hasAccess =
        user?.id && isAuthenticated && user?.roles.some((role) => roles.includes(role))

    const forbidden =
        user?.id && isAuthenticated && !user?.roles.some((role) => roles.includes(role))

    return (
        <>
            {hasAccess ? (
                <Layout key={'s'}>
                    <Component {...rest} />
                </Layout>
            ) : forbidden ? (
                <Layout>
                    <ErrorPage
                        type={403}
                        subTitle="Bạn không có quyền truy cập. Liên hệ quản trị viên để cấp thêm quyền"
                    />
                </Layout>
            ) : (
                <ErrorPage type={404} subTitle="Trang bạn yêu cầu không tồn tại." />
            )}
        </>
    )
}

export default SecurityRoute
