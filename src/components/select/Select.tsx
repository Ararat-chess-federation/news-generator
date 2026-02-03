import { ChangeEvent, Dispatch } from "react";

interface ISelectProps {
  values: string[];
  selectedOption: string;
  setSelectedOption: Dispatch<React.SetStateAction<string>> | Function;
  title: string;
}

const Select = ({
  values,
  selectedOption,
  setSelectedOption,
  title,
}: ISelectProps) => {
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <div>
        <label>{title}</label>
      </div>
      <select
        id={`${title}-select`}
        value={selectedOption}
        onChange={handleSelectChange}
      >
        {values.map((el, index) => (
          <option key={index} value={el} title={el}>
            {el.split(" ").slice(0, 3).join(" ")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
