import { CSSProperties, PropsWithChildren } from "react";
import css from "./Button.module.scss";

type ButtonProps = {
  onClick: () => void;
  style?: CSSProperties;
};

const Button = ({
  onClick,
  children,
  style,
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button className={`${css.button}`} style={style} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
