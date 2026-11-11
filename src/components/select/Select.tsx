import { useId, type ChangeEvent, type Dispatch } from "react";

interface ISelectProps {
  values: string[];
  selectedOption: string;
  setSelectedOption: Dispatch<React.SetStateAction<string>> | Function;
  title: string;
  hideLabel?: boolean;
  className?: string;
}

const Select = ({
  values,
  selectedOption,
  setSelectedOption,
  title,
  hideLabel,
  className = "",
}: ISelectProps) => {
  const id = useId();

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className={`field ${className}`}>
      <label htmlFor={id} className={hideLabel ? "visually_hidden" : "field_label"}>
        {title}
      </label>
      <select id={id} value={selectedOption} onChange={handleSelectChange}>
        {values.map((el) => (
          <option key={el} value={el} title={el}>
            {el.split(" ").slice(0, 3).join(" ")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
