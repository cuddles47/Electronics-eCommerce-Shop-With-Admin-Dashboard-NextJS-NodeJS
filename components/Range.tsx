// *********************
// Role of the component: Range input for price intented to be on the shop page
// Name of the component: Range.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Range min={min} max={max} priceValue={priceValue} setInputCategory={setInputCategory} />
// Input parameters: RangeProps interface
// Output: range input with current range price
// *********************

"use client";
import React, { useState } from 'react'
import { formatCurrency } from "../utils/formatCurrency";

interface RangeProps {
    min: number;
    max: number;
    priceValue: number;
    setInputCategory: any;
}

const Range = ({ min, max, priceValue, setInputCategory } : RangeProps) => {
    const [ currentRangeValue, setCurrentRangeValue ] = useState<number>(priceValue);

    const handleRange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setCurrentRangeValue(parseInt(e.target.value));
    }

  return (
    <div>
        <input type="range" min={min} max={max} value={priceValue} className="range range-warning" />
        <div className="slider-labels mb-2 relative left-[5px]">
          <div className="caption">
            <span>{ `Max price: ${formatCurrency(currentRangeValue)}` }</span>
          </div>
        </div>
    </div>
  )
}

export default Range