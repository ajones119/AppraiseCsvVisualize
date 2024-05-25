import css from "./Toggle.module.scss"
type ToggleProps = {
    value: boolean;
    onClick: () => void;
}

const Toggle = ({value, onClick}: ToggleProps) => {
    return (
        <button
            onClick={onClick}
            className={`${css.toggleButton} ${!value && css.toggled}`}
        >
            <div className={css.thumb} />
        </button>
    )
}

export default Toggle;