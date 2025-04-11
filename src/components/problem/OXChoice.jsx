import { useState, useRef } from 'react';
import correctIcon from '../../assets/correct.png';
import wrongIcon from '../../assets/wrong.png';

export default function OXChoice({ problem, userAttempt }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const optionRefs = useRef([]);

  const options = [
    { label: 'O', src: correctIcon },
    { label: 'X', src: wrongIcon },
  ];

  return (
    <div className="mt-4 flex justify-center gap-10">
      {options.map((opt, idx) => (
        <div
          key={idx}
          ref={(el) => (optionRefs.current[idx] = el)}
          onClick={() => {
            setSelectedIndex(idx);
            optionRefs.current[idx]?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }}
          className={`
            p-3 w-20 h-20 flex items-center justify-center
            cursor-pointer transition duration-200
            hover:bg-[#f3e8df] rounded-lg
            ${selectedIndex === idx ? 'border-2 border-[#5c4033]' : ''}
          `}
        >
          <img src={opt.src} alt={opt.label} className="w-12 h-12" />
        </div>
      ))}
    </div>
  );
}
