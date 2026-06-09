export default function BorderedTitle(props){
    const className = `inline-block ${props.bg} ${props.txtColor} font-semibold px-4 py-1.5 rounded-full mb-4 border`
    return (
        <span className={className}>
            {props.text}
        </span>
    )
}