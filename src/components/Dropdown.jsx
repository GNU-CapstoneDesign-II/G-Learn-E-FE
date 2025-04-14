import React from 'react';
import styles from './Dropdown.module.css';

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
    <div className={styles.dropdown}>
      <label>{label}</label>

      <select value={value} onChange={onChange}>
        {options.map((option) => {
          const optionLabel = option === 'custom' ? '직접입력' : option;
          return (
            <option key={option} value={option}>
              {optionLabel}
            </option>
          );
        })}
      </select>

      {isCustom && (
        <input
          type="number"
          className={styles.customInput}
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