import Chat from '@/components/chat/Chat'
import { REDIRECT_RESULT_ORDER } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    // const navigate = useNavigate()

    return (
        <div>
            {REDIRECT_RESULT_ORDER}

            <Chat recipient="661e677a4326be0575450488" />
            {/* <Chat_1 recipient="ádas" /> */}
        </div>
    )
}
export default HomePage
