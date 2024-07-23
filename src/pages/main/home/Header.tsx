import React, { useState, useEffect } from 'react'
import { FcPrevious, FcNext } from 'react-icons/fc'

const imageSrcs = [
    'https://salt.tikicdn.com/cache/w750/ts/tikimsp/f1/ac/30/5686185c9c33cbdf005c9ca813bad624.jpg.webp',
    'https://salt.tikicdn.com/cache/w750/ts/tikimsp/a1/b7/6d/45222bff355e9c6c3f79ec7097401bc3.jpg.webp',
    'https://salt.tikicdn.com/cache/w750/ts/tikimsp/a9/29/c2/8a763ef403af76cc989dd57ac4688fab.jpg.webp',
]

const Header = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imageSrcs.length)
    }

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + imageSrcs.length) % imageSrcs.length)
    }

    useEffect(() => {
        const timer = setInterval(nextImage, 3000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="border w-[73rem] h-auto bg-white rounded-lg relative">
            <div className="flex justify-center flex-wrap p-4">
                <div className="w-1/2 h-[20rem] p-1">
                    <img
                        src={imageSrcs[currentIndex]}
                        alt=""
                        className="w-full h-full object-cover rounded-2xl"
                    />
                </div>
                <div className="w-1/2 h-[20rem] p-1">
                    <img
                        src={imageSrcs[(currentIndex + 1) % imageSrcs.length]}
                        alt=""
                        className="w-full h-full object-cover rounded-2xl"
                    />
                </div>
            </div>
            <div className="absolute top-1/2 left-[-5px] right-[-5px] flex justify-between px-4 transform -translate-y-1/2">
                <button
                    onClick={prevImage}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300"
                >
                    <FcPrevious className="text-xl" />
                </button>
                <button
                    onClick={nextImage}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-300"
                >
                    <FcNext className="text-xl" />
                </button>
            </div>
        </div>
    )
}

export default Header
