import React, { useEffect } from 'react';

export default function ContextMenu({ x, y, options, onClose }) {
    useEffect(() => {
        const handleClickOutside = () => onClose();
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [onClose]);

    return (
        <ul
            className="absolute bg-white border border-[#8B623F] rounded-lg shadow-md z-50 py-1"
            style={{ top: y, left: x, minWidth: 120 }}
        >
            {options.map((opt, i) => (
                <li
                    key={i}
                    onClick={e => {
                        e.stopPropagation();
                        opt.onClick();
                        onClose();
                    }}
                    className={[
                        'px-4 py-2 text-sm text-[#5F360A] cursor-pointer hover:bg-[#F9F1E8]',
                        i === 0 ? 'border-b border-[#8B623F]' : '',
                    ].join(' ')}
                >
                    {opt.label}
                </li>
            ))}
        </ul>
    );
}
