// src/components/common/ContextMenu.jsx
import React, { useEffect, useRef } from "react";

/**
 * @param {{
 *   x: number,
 *   y: number,
 *   options: { label: string, onClick: () => void }[],
 *   onClose: () => void
 * }} props
 */
export default function ContextMenu({ x, y, options, onClose }) {
    const ref = useRef(null);

    useEffect(() => {
        // 메뉴 바깥 클릭(또는 우클릭)만 닫기
        const handleMouseDown = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose();
            }
        };
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose();
            }
        };

        // ESC 키 눌러도 닫기
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <ul
            ref={ref}
            className="fixed z-50 bg-white border border-[#8B623F] rounded-lg shadow-md py-1 min-w-[120px] divide-y divide-[#8B623F]"
            style={{ top: y, left: x }}
            onContextMenu={e => e.preventDefault()}
        >
            {options.map((opt, i) => (
                <li
                    key={opt.label}
                    onClick={e => {
                        e.stopPropagation();
                        opt.onClick();
                        onClose();
                    }}
                    className="px-4 py-2 text-sm text-[#5F360A] cursor-pointer hover:bg-[#F9F1E8]"
                >
                    {opt.label}
                </li>
            ))}
        </ul>
    );
}
