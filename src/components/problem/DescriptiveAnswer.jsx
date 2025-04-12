import { useRef } from 'react';

export default function DescriptiveAnswer({ problem, userAttempt, onUserAttemptChange, isSolved }) {
  const textareaRef = useRef(null);
  const submitAnswer = userAttempt?.submitAnswer ?? [''];
  const answer = submitAnswer[0];

  return (
    <div className="mt-4">
      <textarea
        ref={textareaRef}
        rows={4}
        value={answer}
        onChange={(e) => onUserAttemptChange?.(problem.id, [e.target.value])}
        className="w-full border border-gray-300 rounded-lg p-3 resize-none 
                   focus:outline-none focus:ring-2 focus:ring-[#5c4033] text-[#5c4033]"
        placeholder="여기에 답을 입력하세요..."
        onFocus={() =>
          textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        readOnly={isSolved}
      />
    </div>
  );
}