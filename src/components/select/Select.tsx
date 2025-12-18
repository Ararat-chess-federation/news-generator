import { ChangeEvent, Dispatch, useState } from "react";

interface ISelectProps {
  values: string[] | number[];
  selectedOption: string | number;
  setSelectedOption: Dispatch<React.SetStateAction<string>> | Function;
  title: string;
  hideOther?: boolean
}

const OTHER = "Այլ";

export default function Select({
  values,
  selectedOption,
  setSelectedOption,
  title,
  hideOther
}: ISelectProps) {
  const [showInput, setShowInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === OTHER) {
      setShowInput(true);
      setSelectedOption("");

      return;
    }

    setShowInput(false);
    setSelectedOption(value);
    setOtherValue("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtherValue(e.target.value);
  };

  const handleAddOther = () => {
    if (otherValue) {
      setSelectedOption(otherValue);
      setShowInput(false);
      setOtherValue("");
    }
  };

  return (
    <div style={{ marginTop: "16px" }}>
      <div>
        <label>{title}</label>
      </div>
      <select
        id="location-select"
        value={selectedOption || values[0]}
        onChange={handleSelectChange}
      >
        {values.map((el, index) => (
          <option key={index} value={el}>
            {el}
          </option>
        ))}
        {!hideOther && <option value={OTHER}>{OTHER}</option>}
      </select>

      {showInput && (
        <div>
          <input
            type="text"
            value={otherValue}
            onChange={handleInputChange}
            placeholder="Նշեք այլ վայր"
          />
          <button onClick={handleAddOther}>Ավելացնել</button>
        </div>
      )}
    </div>
  );
}
