import { useRef } from 'react';

export default function BlankFill({ problem, userAttempt }) {
  const blanks = problem.title.split('[[$BLANK$]]');
  const inputRefs = useRef([]);

  return (
    <div className="mt-4 text-[#5c4033] leading-9">
      {blanks.map((part, idx) => (
        <span key={idx}>
          {part}
          {idx < blanks.length - 1 && (
            <input
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              className="inline-block w-48 h-9 px-3 py-1 text-center border border-gray-300 rounded-lg shadow-sm 
                         focus:outline-none focus:border-[#5c4033] focus:border-2 mx-1"
              onFocus={() =>
                inputRefs.current[idx]?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center', // 'start'로 하면 화면 맨 위까지 감
                })
              }
            />
          )}
        </span>
      ))}
    </div>
  );
}
