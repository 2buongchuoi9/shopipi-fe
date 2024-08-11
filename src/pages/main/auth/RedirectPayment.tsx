import { useMessage } from '@/hooks'
import ErrorPage from '@/pages/ErrorPage'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RedirectPayment = () => {
    const navigate = useNavigate()
    const [data, setData] = useState<{ code: string | null; message: string | null } | null>(null)
    const { success } = useMessage()

    useEffect(() => {
        const handleRedirect = async () => {
            const queryString = window.location.search
            const urlParams = new URLSearchParams(queryString)
            const receivedData = {
                code: urlParams.get('code'),
                message: urlParams.get('message'),
            }
            console.log('Data from URL:', receivedData)
            setData(receivedData) // Lưu trữ dữ liệu vào state
        }

        handleRedirect()
    }, [])

    useEffect(() => {
        if (data?.code === '200' && data.message) {
            success('Bạn đặt hàng thành công')
            navigate('/user/order')
        }
    }, [data, navigate, success])

    return (
        <div>
            {data && data.code !== '200' && data.message && (
                <ErrorPage
                    title="Thanh toán không thành công"
                    subTitle={`Code: ${data.code} \nChi tiết: ${data.message}`}
                />
            )}
        </div>
    )
}

export default RedirectPayment
