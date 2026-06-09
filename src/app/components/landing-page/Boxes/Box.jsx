export default function Box(props) {
    return (
        <div className={`text-left p-8 rounded-2xl border transition-all group hover:shadow-xl ${props.bg} ${props.border} ${props.shadow}`}>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={`${props.icon}`}></path></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{props.title}</h3>
            <p className="text-white/75 text-sm leading-relaxed">{props.text}</p>
        </div>
    )
}