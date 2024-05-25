import { PropsWithChildren } from "react";
import css from "./Button.module.scss"

type ButtonProps = {
    onClick: () => void,
    color?: string,
};

const Button = ({
    onClick,
    children,

}: PropsWithChildren<ButtonProps>) => {

    return (
        <button
            className={`${css.button}`}
            onClick={onClick}
        >{children}</button>
    );
}

export default Button;