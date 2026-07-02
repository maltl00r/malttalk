import type { ReactElement } from "react";

interface BoxProps {
    bg: string;
    shadow: string;
    border: string;
    title: string;
    text: string;
    icon: string;
}

export default function Box(props: BoxProps): ReactElement {
    return (
        <div className={`text-left p-8 rounded-2xl border transition-all group hover:shadow-xl ${props.bg} dark:${props.bg} ${props.border} dark:${props.border} ${props.shadow}`}>
            <div className="w-12 h-12 bg-white/20 dark:bg-white/20 rounded-xl flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-100 dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={props.icon}></path></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{props.title}</h3>
            <p className="text-gray-700 dark:text-white/75 text-sm leading-relaxed">{props.text}</p>
        </div>
    );
}
