import { createContext, ReactNode, useState } from 'react'

export interface LoadingContextType {
    loading: boolean
    setLoading: (isLoading: boolean) => void
}

export const LoadingContext = createContext<LoadingContextType>({} as LoadingContextType)

export default function LoadingProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false)

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {loading && (
                <div
                    className={`fixed inset-0 z-50 flex justify-center items-center bg-slate-900/40 backdrop-blur-sm `}
                >
                    <div className="flex items-center space-x-5 z-50">
                        <div className="w-24 h-24 border-[10px] border-t-blue-500 border-solid rounded-full animate-spin"></div>
                        {/* <p className="text-white text-xl font-semibold">Loading...</p> */}
                    </div>
                </div>
            )}

            {children}
        </LoadingContext.Provider>
    )
}
