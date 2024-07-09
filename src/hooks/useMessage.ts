import { MessageContext } from '@/contexts/MessageContext'
import { useContext } from 'react'

const useMessage = () => useContext(MessageContext)
export default useMessage
