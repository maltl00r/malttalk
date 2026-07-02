import type { ReactElement } from "react";

interface FeatureProps {
    soon?: boolean;
    bg: string;
    textColor: string;
    border: string;
    title: string;
    text: string;
    icon: string;
}

export default function Feature(props: FeatureProps): ReactElement {
    return (
        <div className={`text-left p-7 bg-white dark:bg-[#111118] rounded-2xl ${props.soon ? `border border-dashed border-2 ${props.border}` : 'border border-gray-200 dark:border-[#1f1f2e]'} hover:border-blue-400 dark:hover:border-primary-start/30 hover:shadow-lg hover:shadow-blue-400/10 dark:hover:shadow-primary-start/5 transition-all relative overflow-hidden`}>
            {props.soon ? <span className={`absolute top-4 right-4 text-xs font-bold ${props.bg} ${props.textColor} border ${props.border}/20 px-3 py-1 rounded-full`}>Próximamente</span> : null}
            <div className={`w-11 h-11 ${props.bg} ${props.textColor} rounded-xl flex items-center justify-center mb-5`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={props.icon}></path></svg>
            </div>
            <h3 className="font-bold mb-2 text-gray-900 dark:text-white">{props.title}</h3>
            <p className="text-gray-600 dark:text-[#8b8fa8] text-sm leading-relaxed">{props.text}</p>
        </div>
    );
}
