// *********************
// Role of the component: Range with labels for price intented to be on the shop page
// Name of the component: RangeWithLabels.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <RangeWithLabels />
// Input parameters: no input parameters
// Output: range input with the labels
// *********************

"use client";

import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { formatCurrency } from "../utils/formatCurrency";

interface RangeWithLabelsProps {
  setMaxPrice: (price: number) => void;
}

const RangeWithLabels: FC<RangeWithLabelsProps> = ({ setMaxPrice }) => {
  const [value, setValue] = useState(4000);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  useEffect(() => {
    setMaxPrice(value);
  }, [value, setMaxPrice]);

  return (
    <div className="mt-8">
      <div className="slider-labels mb-2 relative left-[5px]">
        <div className="caption">
          <strong className="text-lg block mb-1">
            Price range: {formatCurrency(0)} - {formatCurrency(value)}
          </strong>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="range"
          min="0"
          max="4000"
          value={value}
          step="100"
          className="w-full h-2 bg-blue-100 accent-blue-600 rounded-lg appearance-none cursor-pointer"
          onChange={handleChange}
        />
      </div>
      <ul className="flex justify-between mt-2 w-full px-[4px]">
        <span>{formatCurrency(0)}</span>
        <span>{formatCurrency(200)}</span>
        <span>{formatCurrency(400)}</span>
        <span>{formatCurrency(600)}</span>
        <span>{formatCurrency(4000)}</span>
      </ul>
    </div>
  );
};

export default RangeWithLabels;
