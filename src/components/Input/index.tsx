import { ChangeEvent } from "react";
//import css from "./Input.module.scss"
type InputProps<T> = {
  value?: T;
  onChange: (newValue: T) => void;
  number?: boolean;
  placeholder?: string;
};

const Input = <T extends string | number>({
  value,
  onChange,
  number,
}: InputProps<T>) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    let newValue = value;

    onChange(newValue as unknown as T);
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      type={number ? "number" : "text"}
      //placeholder={placeholder}
      //className={className}
    />
  );
};

export default Input;
