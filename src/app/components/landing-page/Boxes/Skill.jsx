export default function Skill(props) {
    return(
        <div className={`p-6 ${props.border} ${props.bg2} rounded-2xl border hover:scale-[1.02] transition-transform`}>
            <div className={`w-10 h-10 ${props.bg} rounded-xl flex items-center justify-center mb-4`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={`${props.icon}`}></path></svg>
            </div>
            <h4 className="font-bold text-foreground mb-1 text-base">{props.title}</h4>
            <p className="text-[#8b8fa8] text-xs leading-relaxed">{props.text}</p>
        </div>
    )
}