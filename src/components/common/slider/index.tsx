interface SliderProps {
    percentage : number
}

export default function Slider ({percentage} : SliderProps) {
    return(
        <div className="relative w-full h-2 my-2 bg-[#EDEFF0] rounded">
            <div 
                style={{ width: `${percentage}%` }} 
                className={`absolute w-[${percentage}%] h-full top-0 left-0 bg-gradient-to-r from-[#61CD81] to-[#24BC48] rounded`}/>
        </div>
    )
}