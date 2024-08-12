import { ChangeEvent, Dispatch, useState } from "react";

interface ISelectProps {
  values: string[];
  selectedOption: string;
  setSelectedOption: Dispatch<React.SetStateAction<string>>;
  title: string;
}

export default function Select({
  values,
  selectedOption,
  setSelectedOption,
  title,
}: ISelectProps) {
  const [showInput, setShowInput] = useState<boolean>(false);
  const [otherValue, setOtherValue] = useState<string>("");

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "Other") {
      setShowInput(true);
      setSelectedOption("");
    } else {
      setShowInput(false);
      setSelectedOption(value);
      setOtherValue("");
    }
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
    <div>
      <div>
        <label htmlFor="location-select">{title}</label>
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
        <option value="Other">Other</option>
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
