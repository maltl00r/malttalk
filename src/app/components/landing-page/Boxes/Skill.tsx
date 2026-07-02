import type { ReactElement } from "react";

interface SkillProps {
    bg: string;
    bg2: string;
    border: string;
    title: string;
    text: string;
    icon: string;
}

export default function Skill(props: SkillProps): ReactElement {
    return (
        <div className={`p-6 ${props.border} dark:${props.border} ${props.bg2} dark:${props.bg2} rounded-2xl border hover:scale-[1.02] transition-transform`}>
            <div className={`w-10 h-10 ${props.bg} dark:${props.bg} rounded-xl flex items-center justify-center mb-4`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white dark:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={props.icon}></path></svg>
            </div>
            <h4 className="font-bold text-gray-900 dark:text-foreground mb-1 text-base">{props.title}</h4>
            <p className="text-gray-600 dark:text-[#8b8fa8] text-xs leading-relaxed">{props.text}</p>
        </div>
    );
}
