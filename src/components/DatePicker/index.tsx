import ReactDatePicker from "react-datepicker";
import css from "./DatePicker.module.scss";
type DatePickerProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
};

const DatePicker = ({ value, onChange }: DatePickerProps) => {
  return (
    <div className={css.datePickerWrapper}>
      <div className={css.label}>Effective Date</div>
      <ReactDatePicker
        className={css.datePicker}
        selected={value}
        onChange={onChange}
      />
    </div>
  );
};

export default DatePicker;
