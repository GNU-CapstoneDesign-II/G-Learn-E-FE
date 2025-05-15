import React from 'react';

const SelectableButton = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`px-6 py-3 border-[1.5px] rounded-full transition-all duration-200
        ${isActive
          ? 'bg-brown text-white font-bold border-brown'
          : 'bg-white text-darkbrown border-lightbrown hover:bg-lightbrown hover:text-white'
        }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default SelectableButton;