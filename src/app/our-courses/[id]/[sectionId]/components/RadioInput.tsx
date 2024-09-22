import React, { SetStateAction, useEffect, useRef } from "react";

interface Props {
  idOfInput: string;
  labelName: string;
  setType: React.Dispatch<SetStateAction<string>>;
  type: string;
  children?: any;
}

const RadioInput: React.FC<Props> = ({ idOfInput, labelName, setType, type, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      const r = ref.current as HTMLInputElement;
      if (type == r.value) {
        r.click();
      }
    }
  }, [ref.current]);

  return (
    <div className="relative w-[100px] h-[100px] border border-black rounded-xl shadow-xl flex justify-center items-center flex-col overflow-hidden">
      <input
        ref={ref}
        onChange={(e) => setType(e.target.value)}
        className="w-full h-full opacity-0 absolute cursor-pointer"
        type="radio"
        name="radio"
        value={idOfInput}
        id={idOfInput}
      />
      <div className="radio-title transition-colors duration-300 w-full h-full flex justify-center items-center flex-col ">
        {children}
        <label htmlFor={idOfInput} className="text-xl font-bold">
          {labelName}
        </label>
      </div>
    </div>
  );
};

export default RadioInput;
