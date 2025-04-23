import { useState, useEffect, useRef } from 'react';

export default function MultipleChoice({ problem, userAttempt, onUserAttemptChange, isSolved }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const optionRefs = useRef([]);

  useEffect(() => {
    const selected = userAttempt?.submitAnswer?.[0];
    const index = problem.options.findIndex((_, idx) => String(idx + 1) === selected);
    setSelectedIndex(index);
  }, [userAttempt?.submitAnswer, problem.options]);

  const handleClick = (idx) => {
    if (isSolved) return;
    setSelectedIndex(idx);
    optionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    onUserAttemptChange?.(problem.id, [String(idx + 1)]);
  };

  return (
    <div className="mt-3 space-y-2">
      {problem.options.map((opt, idx) => (
        <div
          key={idx}
          ref={(el) => (optionRefs.current[idx] = el)}
          onClick={() => handleClick(idx)}
          className={`p-3 text-[#5c4033] cursor-pointer rounded-lg hover:bg-[#f3e8df] 
            ${selectedIndex === idx ? 'border-2 border-[#5c4033]' : ''}`}
        >
          {idx + 1}. {opt}
        </div>
      ))}
    </div>
  );
}