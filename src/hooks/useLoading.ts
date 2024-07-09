import { LoadingContext } from '@/contexts/LoadingContext'
import { useContext } from 'react'

const useLoading = () => useContext(LoadingContext)

export default useLoading
