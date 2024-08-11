import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { HTMLAttributes, useEffect, useState } from 'react'
// import duration from "dayjs/plugin/duration"
// import relativeTime from "dayjs/plugin/relativeTime"
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
// dayjs.extend(duration)
// dayjs.extend(relativeTime)

dayjs.locale('vi')
dayjs.extend(utc)
dayjs.extend(timezone)

function timeAgo(time: string): string {
    const now = dayjs()
    const then = dayjs(time, 'DD-MM-YYYY HH:mm:ss')

    const seconds = now.diff(then, 'second')
    const minutes = now.diff(then, 'minute')
    const hours = now.diff(then, 'hour')
    const days = now.diff(then, 'day')
    const weeks = now.diff(then, 'week')
    const months = now.diff(then, 'month')
    const years = now.diff(then, 'year')

    if (seconds < 60) return `${seconds} giây trước`
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    if (days < 2) return `hôm qua ${hours % 24} giờ`
    if (days < 7) return `${days} ngày trước`
    if (weeks < 4) return `${weeks} tuần trước`
    if (months < 12) return `${months} tháng trước`
    if (years < 1) return `${years} năm trước`

    return then.format('HH:mm DD/MM/YYYY')
}

type Props = HTMLAttributes<HTMLSpanElement> & {
    createdAt: string
}

const TimeCount = ({ createdAt, ...rest }: Props) => {
    // const a = dayjs(createdAt, 'DD-MM-YYYY HH:mm:ss')
    const [time, setTime] = useState(() => timeAgo(createdAt))

    useEffect(() => {
        setTime(timeAgo(createdAt))

        const timer = setInterval(() => {
            setTime(timeAgo(createdAt))
        }, 15000) // cập nhật thời gian sau mỗi 60 giây

        return () => {
            clearInterval(timer) // dọn dẹp khi component unmount
        }
    }, [createdAt])

    return (
        <>
            {/* các thông tin khác của comment */}
            <span {...rest}>{time === 'Invalid Date' ? createdAt : time}</span>
        </>
    )
}
export default TimeCount
