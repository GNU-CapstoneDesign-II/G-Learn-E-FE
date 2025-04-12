import MultipleChoice from './MultipleChoice';
import OXChoice from './OXChoice';
import BlankFill from './BlankFill';
import DescriptiveAnswer from './DescriptiveAnswer';

/*
problem: {
    "id": 1,
    "problemNumber": 1,
    "type": "MULTIPLE", MULTIPLE | OX | BLANK | DESCRIPTIVE
    "title": "문제 제목",
    "options": ["보기1", "보기2", "보기3", "보기4"], | null
    "answer": ["정답1"] | null,
    "explanation": "문제 해설",
}

*/

export default function ProblemCard({ problem, userAttempt, onUserAttemptChange, isSolved }) {
    const renderProblem = () => {
      switch (problem.type) {
        case 'MULTIPLE':
          return <MultipleChoice problem={problem} userAttempt={userAttempt} onUserAttemptChange={onUserAttemptChange} isSolved={isSolved} />;
        case 'OX':
          return <OXChoice problem={problem} userAttempt={userAttempt} onUserAttemptChange={onUserAttemptChange} isSolved={isSolved} />;
        case 'BLANK':
          return <BlankFill problem={problem} userAttempt={userAttempt} onUserAttemptChange={onUserAttemptChange} isSolved={isSolved} />;
        case 'DESCRIPTIVE':
          return <DescriptiveAnswer problem={problem} userAttempt={userAttempt} onUserAttemptChange={onUserAttemptChange} isSolved={isSolved} />;
        default:
          return <div>알 수 없는 문제 유형</div>;
      }
    };
  
    const titleText =
      problem.type === 'BLANK'
        ? '다음 문장의 빈칸을 채우세요.'
        : problem.title;
  
    return (
      <div className="w-full text-[#5c4033] font-medium">
        <p className="mb-4 text-[#5c4033] text-lg">
          < span className="font-bold text-xl">문제 {problem.problemNumber}. {titleText}</span>
        </p>
  
        {renderProblem()}
  
        {isSolved && (
          <div className="mt-5 px-4 py-3 bg-[#f9f6f3] rounded-xl border border-[#e2e2e2] text-sm">
            <p className="mb-1 font-bold text-[#5c4033]">
              정답: {problem.answers?.join(', ') ?? '없음'}
            </p>
            {problem.explanation && (
              <p className="text-[#5c4033] whitespace-pre-line">
                {problem.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }