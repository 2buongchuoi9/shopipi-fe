import { REDIRECT_RESULT_ORDER } from '@/utils/constants'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate()

    // useEffect(() => {
    //     navigate('/product')
    // }, [])
    return <div>{REDIRECT_RESULT_ORDER}</div>
}
export default HomePage
