import { useRef } from 'react';

export default function BlankFill({ problem, userAttempt, onUserAttemptChange, isSolved }) {
  const blanks = problem.title.split('[[$BLANK$]]');
  const inputRefs = useRef([]);
  const submitAnswer = userAttempt?.submitAnswer ?? [];

  const handleChange = (value, idx) => {
    if (isSolved) return;
    const updated = [...submitAnswer];
    updated[idx] = value;
    onUserAttemptChange?.(problem.id, updated);
  };

  return (
    <div className="mt-4 text-[#5c4033] leading-9">
      {blanks.map((part, idx) => (
        <span key={idx}>
          {part}
          {idx < blanks.length - 1 && (
            <input
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              value={submitAnswer[idx] ?? ''}
              onChange={(e) => handleChange(e.target.value, idx)}
              className="inline-block w-48 h-9 px-3 py-1 text-center border border-gray-300 rounded-lg shadow-sm 
                         focus:outline-none focus:border-[#5c4033] focus:border-2 mx-1"
              onFocus={() =>
                inputRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
              readOnly={isSolved}
            />
          )}
        </span>
      ))}
    </div>
  );
}