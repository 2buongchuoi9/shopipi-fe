import { Tooltip } from 'antd'
import { CiCircleQuestion } from 'react-icons/ci'

type Props = {
    title: string
    tooltip: string
}

const ExtraQuestion = ({ title, tooltip }: Props) => {
    return (
        <div className="flex items-center space-x-1">
            <p>{title}</p>
            <Tooltip title={tooltip}>
                <CiCircleQuestion className="" size={16} />
            </Tooltip>
        </div>
    )
}
export default ExtraQuestion
