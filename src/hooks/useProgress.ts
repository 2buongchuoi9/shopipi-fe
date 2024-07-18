import { ProgressContext } from '@/contexts/ProgressContext'
import { useContext } from 'react'

const useProgress = () => useContext(ProgressContext)

export default useProgress
