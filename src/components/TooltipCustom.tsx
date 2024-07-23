import { Tooltip } from 'antd'
import { ReactNode } from 'react'

type Props = {
    title: string
    condition: boolean | undefined
    content: ReactNode
}

const TooltipCustom = ({ title, condition, content }: Props) => {
    return (
        <>
            <Tooltip title={!!condition && title}>{content}</Tooltip>
        </>
    )
}
export default TooltipCustom
