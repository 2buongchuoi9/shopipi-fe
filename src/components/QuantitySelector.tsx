import { Button, Input } from 'antd'
import { useState } from 'react'

type Props = {
    initialQuantity?: number
    onChange?: (quantity: number) => void
    disabled?: boolean
}

const QuantitySelector = ({ initialQuantity = 1, onChange, disabled = false }: Props) => {
    const [quantity, setQuantity] = useState(initialQuantity)

    const handleIncrement = () => {
        setQuantity((prevQuantity) => prevQuantity + 1)
        onChange && onChange(quantity + 1)
    }

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity((prevQuantity) => prevQuantity - 1)
            onChange && onChange(quantity - 1)
        }
    }

    const handleInputChange = (e: any) => {
        const value = Math.max(1, parseInt(e.target.value || '1', 10))
        setQuantity(value)
        onChange && onChange(value)
    }

    return (
        <div className="flex items-center space-x-1">
            <Button onClick={handleDecrement} disabled={quantity <= 1}>
                -
            </Button>
            <Input
                value={quantity}
                onChange={handleInputChange}
                className="w-14 text-center"
                type="number"
            />
            <Button onClick={handleIncrement} disabled={disabled}>
                +
            </Button>
        </div>
    )
}

export default QuantitySelector
