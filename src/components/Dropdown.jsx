import React from 'react';

const Dropdown = ({
  label,
  options,
  value,
  onChange,
  customValue,
  onCustomChange,
}) => {
  const isCustom = value === 'custom';

  return (
    // ✅ dropdown 컴포넌트 전체 컨테이너
    <div className="flex flex-col">
      {/* ✅ 드롭다운의 레이블 스타일 */}
      <label className="text-sm font-normal mb-1 text-black">{label}</label>

      {/* ✅ 드롭다운 select 박스 스타일 */}
      <select
        value={value}
        onChange={onChange}
        className="p-1 text-base text-black font-normal border border-[#ccc] rounded-lg cursor-pointer transition-colors duration-300 hover:border-brown focus:outline-none focus:border-brown"
      >
        {options.map((option) => {
          const optionLabel = option === 'custom' ? '직접입력' : option;
          return (
            <option
              key={option}
              value={option}
              className="text-black font-normal"
            >
              {optionLabel}
            </option>
          );
        })}
      </select>

      {/* ✅ 커스텀 숫자 입력 필드 */}
      {isCustom && (
        <input
          type="number"
          className="w-[100px] mt-1 p-1 text-base text-black font-normal border border-[#ccc] rounded-lg transition-colors duration-300 hover:border-brown focus:outline-none focus:border-brown"
          placeholder="숫자 입력"
          value={customValue}
          onChange={onCustomChange}
          min={1}
        />
      )}
    </div>
  );
};

export default Dropdown;