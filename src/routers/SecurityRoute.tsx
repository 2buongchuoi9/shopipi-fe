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

    const hasAuth = !user?.id && !isAuthenticated

    const forbidden =
        user?.id && isAuthenticated && !user?.roles.some((role) => roles.includes(role))

    if (!isAuthenticated) {
        return (
            <Layout>
                <ErrorPage type={403} subTitle="Bạn cần đăng nhập để truy cập trang này." />
            </Layout>
        )
    } else if (hasAccess) {
        return (
            <Layout key={'s'}>
                <Component {...rest} />
            </Layout>
        )
    } else if (forbidden) {
        return (
            <Layout>
                <ErrorPage
                    type={403}
                    subTitle="Bạn không có quyền truy cập. Liên hệ quản trị viên để cấp thêm quyền"
                />
            </Layout>
        )
    } else {
        return <ErrorPage type={404} subTitle="Trang bạn yêu cầu không tồn tại." />
    }

    // return (
    //     <>
    //         {hasAuth ? (
    //             <Layout>
    //                 <ErrorPage type={403} subTitle="Bạn cần đăng nhập để truy cập trang này." />
    //             </Layout>
    //         ) : hasAccess ? (
    //             <Layout key={'s'}>
    //                 <Component {...rest} />
    //             </Layout>
    //         ) : forbidden ? (
    //             <Layout>
    //                 <ErrorPage
    //                     type={403}
    //                     subTitle="Bạn không có quyền truy cập. Liên hệ quản trị viên để cấp thêm quyền"
    //                 />
    //             </Layout>
    //         ) : (
    //             <ErrorPage type={404} subTitle="Trang bạn yêu cầu không tồn tại." />
    //         )}
    //     </>
    // )
}

export default SecurityRoute
