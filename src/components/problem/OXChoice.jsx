import { useState, useEffect, useRef } from 'react';
import correctIcon from '../../assets/correct.png';
import wrongIcon from '../../assets/wrong.png';

export default function OXChoice({ problem, userAttempt, onUserAttemptChange, isSolved }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const optionRefs = useRef([]);

  const options = [
    { label: 'O', src: correctIcon },
    { label: 'X', src: wrongIcon },
  ];

  useEffect(() => {
    const selected = userAttempt?.submitAnswer?.[0];
    const index = options.findIndex((opt) => opt.label === selected);
    setSelectedIndex(index);
  }, [userAttempt?.submitAnswer]);

  const handleClick = (idx) => {
    if (isSolved) return;
    setSelectedIndex(idx);
    optionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    onUserAttemptChange?.(problem.id, [options[idx].label]);
  };

  return (
    <div className="mt-4 flex justify-center gap-10">
      {options.map((opt, idx) => (
        <div
          key={idx}
          ref={(el) => (optionRefs.current[idx] = el)}
          onClick={() => handleClick(idx)}
          className={`p-3 w-20 h-20 flex items-center justify-center rounded-lg 
            transition duration-200 cursor-pointer hover:bg-[#f3e8df] 
            ${selectedIndex === idx ? 'border-2 border-[#5c4033]' : ''}`}
        >
          <img src={opt.src} alt={opt.label} className="w-12 h-12" />
        </div>
      ))}
    </div>
  );
}