// src/components/SelectableButton.jsx
import React from 'react';

const SelectableButton = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`px-6 py-3 border-[1.5px] rounded-full cursor-pointer transition-all ${
        isActive
          ? 'bg-brown text-white font-bold border-brown'
          : 'bg-white text-darkbrown border-lightbrown'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default SelectableButton;