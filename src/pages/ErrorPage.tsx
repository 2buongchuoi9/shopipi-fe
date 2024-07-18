import { Button, Result } from 'antd'
import { ResultStatusType } from 'antd/es/result'
import { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
    type?: number
    title?: string
    subTitle?: string
    extra?: JSX.Element
    callBack?: () => void
}

const ErrorPage = ({ type = 404, title, subTitle, extra, callBack }: Props) => {
    const navigate = useNavigate()

    const errorType: Record<
        number,
        { status: string; title: string; subTitle: string; extra: ReactElement }
    > = {
        403: {
            status: '403',
            title: '403',
            subTitle: 'Sorry, you are not authorized to access this page.',
            extra: (
                <Button
                    type="primary"
                    onClick={
                        callBack ||
                        function () {
                            navigate('/')
                        }
                    }
                >
                    Back Home
                </Button>
            ),
        },

        404: {
            status: '404',
            title: '404',
            subTitle: 'Sorry, the page you visited does not exist.',
            extra: (
                <Button
                    type="primary"
                    onClick={
                        callBack ||
                        function () {
                            navigate('/')
                        }
                    }
                >
                    Back Home
                </Button>
            ),
        },
        500: {
            status: '500',
            title: '500',
            subTitle: 'Sorry, the server is wrong.',
            extra: (
                <Button
                    type="primary"
                    onClick={
                        callBack ||
                        function () {
                            navigate('/')
                        }
                    }
                >
                    Back Home
                </Button>
            ),
        },
        // warning: {
        //     status: 'warning',
        //     title: 'There are some problems with your operation.',
        //     subTitle: 'Sorry, the server is wrong.',
        //     extra: <Button type="primary">Go Console</Button>,
        // },
    }

    return (
        <>
            <Result
                status={errorType[type].status as ResultStatusType}
                title={title || errorType[type].title}
                subTitle={subTitle || errorType[type].subTitle}
                extra={extra || errorType[type].extra}
            />
        </>
    )
}

export default ErrorPage
