import { Button, Input } from 'antd'
import { MdOutlineEdit } from 'react-icons/md'

type Props = {
    key: string | null
    values: string[]
}
const CreateVariant = ({ key = null, values = [] }: Props) => {
    return (
        <div className="relative">
            <Button className="absolute right-0 top-0">X</Button>
            <div className="flex items-center space-x-2">
                {key ? (
                    <p>
                        {key}
                        <MdOutlineEdit />
                    </p>
                ) : (
                    <Input
                        placeholder="Tên biến thể"
                        count={{
                            show: true,
                            max: 10,
                        }}
                        autoFocus={key === null}
                    />
                )}
            </div>
        </div>
    )
}
export default CreateVariant
