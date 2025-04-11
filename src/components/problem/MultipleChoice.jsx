import { useState, useRef } from 'react';

export default function MultipleChoice({ problem, userAttempt }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const optionRefs = useRef([]);

  return (
    <div className="mt-3 space-y-2">
      {problem.options.map((opt, idx) => (
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
          className={`p-3 text-[#5c4033] cursor-pointer rounded-lg hover:bg-[#f3e8df] 
            ${selectedIndex === idx ? 'border-2 border-[#5c4033]' : ''}`}
        >
          {idx + 1}. {opt}
        </div>
      ))}
    </div>
  );
}
