import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.module.jsx';
import Dropdown from '../components/Dropdown.jsx';
import styles from './ProblemGenerator.module.css';
import logoImageLight from '../assets/image-logo-light.png';

const ProblemGenerator = () => {
  const navigate = useNavigate();
  const [inputType, setInputType] = useState('text');
  const [content, setContent] = useState('');
  const [activeButton, setActiveButton] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('중');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
        document.body.style.overflow = 'hidden'; // ✅ 스크롤 막기
    } else {
        document.body.style.overflow = 'auto';   // ✅ 다시 스크롤 가능
    }

    // 컴포넌트가 unmount되거나 리렌더될 때 정리
    return () => {
        document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  const [typeOptions, setTypeOptions] = useState({
    '객관식': { optionCount: 5, questionCount: 30, customQuestionCount: '' },
    'O/X 퀴즈': { questionCount: 5, customQuestionCount: '' },
    // '단답형': { questionCount: 5, customQuestionCount: '' },
    '주관식': { questionCount: 5, customQuestionCount: '' },
    '빈칸 채우기': { optionCount: 2, questionCount: 5, customQuestionCount: '' },
    // '다중 선택': { optionCount: 5, questionCount: 5, customQuestionCount: '' },
  });

  const updateTypeOption = (type, field, value) => {
    setTypeOptions((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const [openDropdowns, setOpenDropdowns] = useState({
    '객관식': false,
    'O/X 퀴즈': false,
    // '단답형': false,
    '주관식': false,
    '빈칸 채우기': false,
    // '다중 선택': false,
  });

  const toggleDropdown = (type) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const toggleTypeSelection = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleSave = () => {
    const selectedOptions = selectedTypes.map((type) => {
      const options = typeOptions[type];
      const finalQuestionCount =
        options.questionCount === 'custom'
          ? Number(options.customQuestionCount) || 0
          : Number(options.questionCount);

      return {
        type,
        questionCount: finalQuestionCount,
        optionCount: options.optionCount || null,
      };
    });

    console.log('선택된 문제 유형:', selectedOptions);
    console.log('선택된 난이도:', selectedDifficulty);

    closeModal();
  };

  const closeModal = () => {
    setActiveButton(null);
  };

  const handleGenerateClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSelectedTypes([]);
      setOpenDropdowns({
      '객관식': false,
      'O/X 퀴즈': false,
      '단답형': false,
      '주관식': false,
      '빈칸 채우기': false,
      '다중 선택': false,
      });
      // navigate('/private');
    }, 3000);
  };

  return (
    <>
      <Navbar />

      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingBox}>
            <img src={logoImageLight} alt="G-Learn-E Logo" className={styles.loadingImage} />
            <p className={styles.loadingText}>문제를 생성하고 있어요!<br />잠시만 기다려주세요 . . .</p>
          </div>
        </div>
      )}

      <div className={styles.pageContainer}>
        <div className={styles.sectionIntro}>
          <h2>내용 입력 및 문제 유형을 선택한 후 문제를 생성해보세요!</h2>

          <div className={styles.inputTypeContainer}>
            {['text', 'pdf', 'voice'].map((type) => (
              <button
                key={type}
                className={`${styles.inputTypeButton} ${inputType === type ? styles.inputTypeButtonActive : ''}`}
                onClick={() => setInputType(type)}
              >
                {type === 'text' ? 'T Text' : type === 'pdf' ? '📄 PDF' : '🎙️ 음성파일'}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sectionInput}>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textareaBox}
              placeholder="문제를 생성할 내용을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
            />
            <div className={styles.charCount}>{content.length} / 1000</div>
            <div className={styles.bottomControls}>
              <button
                className={`${styles.controlButton} ${activeButton === 'type' ? styles.controlButtonActive : ''}`}
                onClick={() => setActiveButton(activeButton === 'type' ? null : 'type')}
              >
                문제 유형
              </button>
              <button
                className={`${styles.controlButton} ${activeButton === 'generate' ? styles.controlButtonActive : ''}`}
                onClick={handleGenerateClick}
              >
                문제 생성
              </button>
            </div>
          </div>
        </div>

        {activeButton === 'type' && (
          <div className={styles.sectionModal} onClick={closeModal}>
            <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <span>문제 유형</span>
                <button onClick={closeModal} className={styles.closeButton}>✖</button>
              </div>

              <div className={styles.modalContent}>
                <ul className={styles.typeList}>
                  {Object.keys(typeOptions).map((type, index) => {
                    const isActive = selectedTypes.includes(type);
                    return (
                      <li
                        key={type}
                        className={`${styles.typeItem} ${isActive ? styles.active : ''}`}
                        onClick={() => {
                          toggleTypeSelection(type);
                          toggleDropdown(type);
                        }}
                      >
                        <span className={styles.typeIcon}>
                          {['🎯', '❓', /*'💬', */'🗨️', '🧩'/*, '✔️'*/][index]}
                        </span>
                        <span className={styles.typeText}>{type}</span>

                        {openDropdowns[type] && (
                          <div className={styles.dropdownContainer} onClick={(e) => e.stopPropagation()}>
                            {'optionCount' in typeOptions[type] && (
                              <Dropdown
                                label={type === '빈칸 채우기' ? '빈칸 수' : '선지 수'}
                                options={[1, 2, 3, 4, 5]}
                                value={typeOptions[type].optionCount}
                                onChange={(e) => updateTypeOption(type, 'optionCount', e.target.value)}
                              />
                            )}
                            <Dropdown
                              label="질문 수"
                              options={[5, 10, 15, 30, 'custom']}
                              value={typeOptions[type].questionCount}
                              onChange={(e) => updateTypeOption(type, 'questionCount', e.target.value)}
                              customValue={typeOptions[type].customQuestionCount}
                              onCustomChange={(e) => updateTypeOption(type, 'customQuestionCount', e.target.value)}
                            />
                          </div>
                        )}

                        {isActive && <span className={styles.check}>✓</span>}
                      </li>
                    );
                  })}
                </ul>

                <div className={styles.difficulty}>
                  <span>난이도</span>
                  <select
                    value={selectedDifficulty}
                    onChange={handleDifficultyChange}
                    className={styles.difficultySelect}
                  >
                    <option value="상">상</option>
                    <option value="중">중</option>
                    <option value="하">하</option>
                  </select>
                </div>

                <button className={styles.saveButton} onClick={handleSave}>저장</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProblemGenerator;