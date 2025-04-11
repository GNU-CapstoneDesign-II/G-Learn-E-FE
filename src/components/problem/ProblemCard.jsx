import MultipleChoice from './MultipleChoice';
import OXChoice from './OXChoice';
import BlankFill from './BlankFill';
import DescriptiveAnswer from './DescriptiveAnswer';

export default function ProblemCard({ problem, userAttempt }) {
    const renderProblem = () => {
        switch (problem.type) {
            case 'MULTIPLE':
                return <MultipleChoice problem={problem} userAttempt={userAttempt} />;
            case 'OX':
                return <OXChoice problem={problem} userAttempt={userAttempt} />;
            case 'BLANK':
                return <BlankFill problem={problem} userAttempt={userAttempt} />;
            case 'DESCRIPTIVE':
                return <DescriptiveAnswer problem={problem} userAttempt={userAttempt} />;
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
                <span className="font-bold text-xl">문제 {problem.problemNumber}. {titleText}</span>
            </p>

            {renderProblem()}
        </div>
    );
}
