import type { ReactElement } from "react";

interface BorderedTitleProps {
    bg: string;
    txtColor: string;
    text: string;
}

export default function BorderedTitle(props: BorderedTitleProps): ReactElement {
    const className = `inline-block ${props.bg} ${props.txtColor} font-semibold px-4 py-1.5 rounded-full mb-4 border`;
    return (
        <span className={className}>
            {props.text}
        </span>
    );
}
