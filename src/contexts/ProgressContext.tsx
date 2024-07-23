// src/ProgressContext.tsx
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { createContext, ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Cấu hình NProgress
NProgress.configure({ showSpinner: false })

export interface ProgressContextType {
    startProgress: () => void
    stopProgress: () => void
}

export const ProgressContext = createContext<ProgressContextType>({} as ProgressContextType)

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
    const [loadingCount, setLoadingCount] = useState(0)
    const location = useLocation()

    const startProgress = () => {
        setLoadingCount((prevCount) => {
            if (prevCount === 0) {
                NProgress.start()
            }
            return prevCount + 1
        })
    }

    const stopProgress = () => {
        setLoadingCount((prevCount) => {
            if (prevCount === 1) {
                NProgress.done()
            }
            return prevCount - 1
        })
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            stopProgress()
        }, 1000)

        return () => {
            clearTimeout(timer)
            // Đảm bảo rằng NProgress.done() được gọi khi component unmount để xử lý các trường hợp lỗi
            if (loadingCount > 0) {
                NProgress.done()
            }
        }
    }, [location, loadingCount])

    return (
        <ProgressContext.Provider value={{ startProgress, stopProgress }}>
            {children}
        </ProgressContext.Provider>
    )
}
