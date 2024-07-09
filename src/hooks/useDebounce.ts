import { useState, useEffect } from 'react'

type Props<T> = {
    value: T
    delay: number
}

function useDebounce<T>({ value, delay }: Props<T>) {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)

        return () => clearTimeout(handler)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return debouncedValue
}

export default useDebounce
