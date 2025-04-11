import { useRef } from 'react';

export default function DescriptiveAnswer({ problem, userAttempt }) {
  const textareaRef = useRef(null);

  return (
    <div className="mt-4">
      <textarea
        ref={textareaRef}
        rows={4}
        className="w-full border border-gray-300 rounded-lg p-3 resize-none 
                   focus:outline-none focus:ring-2 focus:ring-[#5c4033] text-[#5c4033]"
        placeholder="여기에 답을 입력하세요..."
        onFocus={() =>
          textareaRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center', // 또는 'start'로 변경 가능
          })
        }
      />
    </div>
  );
}
