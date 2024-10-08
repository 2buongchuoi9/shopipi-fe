import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { accessToken, refreshTokenStorage, clientId } from '@/utils/localStorageUtils'
import { useAuth } from '@/hooks'

const Redirect = () => {
    // const [data, setData] = useState({})
    const navigate = useNavigate()
    const { fetchUser } = useAuth()
    useEffect(() => {
        const handleRedirect = async () => {
            // Đọc dữ liệu từ URL sau chuyển hướng.
            let baseUrl = window.location.origin
            const queryString = window.location.search
            const urlParams = new URLSearchParams(queryString)
            const data = {
                userId: urlParams.get('userId'),
                accessToken: urlParams.get('accessToken'),
                refreshToken: urlParams.get('refreshToken'),
                redirect: urlParams.get('redirect'),
            }
            // Xử lý thông tin token hoặc thực hiện các thao tác khác.
            console.log('Data from URL:', data)

            if (!data.userId || !data.accessToken || !data.refreshToken) return 'loi loi lon roi'

            clientId.set(data.userId)
            accessToken.set(data.accessToken)
            refreshTokenStorage.set(data.refreshToken)

            await fetchUser()
            if (data.redirect) baseUrl = data.redirect

            window.location.href = baseUrl
        }

        handleRedirect()
    }, [])

    return (
        <div>
            okeeeee
            {/* {data && navigate('/')} */}
        </div>
    )
}
export default Redirect

// http://localhost:5173/login-redirect/redirect?
// userId=65d6c02c4933346ad82e3818
// &accessToken=eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0dW5nYmFjaC50dHNAZ21haWwuY29tIiwiaWF0IjoxNzA4NTcyNzE2LCJleHAiOjE3MDg3NDU1MTZ9.gEzP6QWsi_osb25F_8uoysIJ9xqLvHvOr8JCr6-9NA28CZQic5RaxYTMwucwWN3kX-MweN50eN_J20PYmYAtLan6akr_1rPvPvJ5oRFhJ4vFHvaHpB7DTiomNFau3RDQ7EKy8iawDfxGFAX6CbNDCgAFhuo7CPxDQDMVgXg5jiTVQgigsHk61re7pFHvNWkW8r0BpIo3omBB7hGRuGv0qqkRj_1sJvdBkfL2JrxL8Tb5ByZGL1pC-6g1ShJ1KaeN7lwOubsRcCOGFvAOokO86fV2FVZ58ectBhSrzJjzT93nRJhtLlD6NuIvD2kHhOYDlRBW7dEcO3y_dBqa3wtxQw
// &refreshToken=eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0dW5nYmFjaC50dHNAZ21haWwuY29tIiwiaWF0IjoxNzA4NTcyNzE2LCJleHAiOjE3MDg1ODI3OTZ9.GYYyWcQXd2NjaQ-zaTB3IXLlgrQ20ApoWs6sM6iZlG_6QlUJebx9Y6w4ngdUl22QQT2jzU-Br8xPpemgnbDU3AGdY7OoGLSZjYdukm70dPg2u8SLd3fD6SXjOXrEG4BSp2qLjqncNqpZNDDZwbWTBqWAgTRdSsvgqUX93WFjU0cCjLXVicU5--HzYPtBluVGTGBn55gMHOzxT4aMEgfW5ZGkOKhRA-d4gyUwOY0m8ESY_i1TyBF8kAjzMJe7MfTGaT6hUK9mSOrMj36wHMzFYNPazMtKOKqo5SritO2uRsFFrtV4DkaFkgm7ILh_0mRhFK9u6l7RKHrQi1Mo-SUNdg
