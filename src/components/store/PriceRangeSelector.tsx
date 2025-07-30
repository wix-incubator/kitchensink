import React, { useState, useEffect } from 'react';

interface PriceRangeSelectorProps {
  min: number;
  max: number;
  selectedMin: number;
  selectedMax: number;
  setSelectedMin: (price: number) => void;
  setSelectedMax: (price: number) => void;
}

export const PriceRangeSelector: React.FC<PriceRangeSelectorProps> = ({
  min,
  max,
  selectedMin,
  selectedMax,
  setSelectedMin,
  setSelectedMax,
}) => {
  // Local state for immediate UI updates while dragging
  const [localSelectedMin, setLocalSelectedMin] = useState(selectedMin);
  const [localSelectedMax, setLocalSelectedMax] = useState(selectedMax);

  const roundedMin = Math.floor(min);
  const roundedMax = Math.ceil(max);

  return (
    <div>
      <div className="space-y-4">
        <h4 className="text-content-primary font-medium mb-4">Price Range</h4>
        {/* Price Range Display */}
        <div className="flex items-center justify-between text-sm text-content-light">
          <span>${String(roundedMin)}</span>
          <span>${String(roundedMax)}</span>
        </div>

        {/* Dual Range Slider */}
        <div className="relative h-6">
          <div className="absolute top-2 left-0 right-0 h-2 bg-brand-medium rounded-full">
            <div
              className="absolute h-2 rounded-full bg-gradient-primary"
              style={{
                left: `${((localSelectedMin - roundedMin) / (roundedMax - roundedMin)) * 100}%`,
                width: `${
                  ((localSelectedMax - roundedMin) /
                    (roundedMax - roundedMin)) *
                    100 -
                  ((localSelectedMin - roundedMin) /
                    (roundedMax - roundedMin)) *
                    100
                }%`,
              }}
            />
          </div>

          {/* Min Range Input */}
          <input
            type="range"
            min={roundedMin}
            max={roundedMax}
            value={localSelectedMin}
            onChange={e => setLocalSelectedMin(Number(e.target.value))}
            onMouseUp={() => {
              setSelectedMin(localSelectedMin);
            }}
            onTouchEnd={() => {
              setSelectedMin(localSelectedMin);
            }}
            className="absolute top-0 left-0 w-full h-6 bg-transparent appearance-none cursor-pointer range-slider range-slider-min"
            style={{
              zIndex:
                localSelectedMin > roundedMin + (roundedMax - roundedMin) * 0.5
                  ? 2
                  : 1,
            }}
          />

          {/* Max Range Input */}
          <input
            type="range"
            min={roundedMin}
            max={roundedMax}
            value={localSelectedMax}
            onChange={e => setLocalSelectedMax(Number(e.target.value))}
            onMouseUp={() => {
              setSelectedMax(localSelectedMax);
            }}
            onTouchEnd={() => {
              setSelectedMax(localSelectedMax);
            }}
            className="absolute top-0 left-0 w-full h-6 bg-transparent appearance-none cursor-pointer range-slider range-slider-max"
            style={{
              zIndex:
                localSelectedMax < roundedMin + (roundedMax - roundedMin) * 0.5
                  ? 2
                  : 1,
            }}
          />
        </div>

        {/* Manual Price Input */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs text-content-muted mb-1">Min</label>
            <input
              type="number"
              value={localSelectedMin}
              onChange={e => {
                const value = Number(e.target.value) || roundedMin;
                setLocalSelectedMin(value);
                setSelectedMin(value);
              }}
              min={roundedMin}
              max={roundedMax}
              className="w-full px-3 py-2 bg-surface-primary border border-brand-light rounded-lg text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-content-muted mb-1">Max</label>
            <input
              type="number"
              value={localSelectedMax}
              onChange={e => {
                const value = Number(e.target.value) || roundedMax;
                setLocalSelectedMax(value);
                setSelectedMax(value);
              }}
              min={roundedMin}
              max={roundedMax}
              className="w-full px-3 py-2 bg-surface-primary border border-brand-light rounded-lg text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSelector;
