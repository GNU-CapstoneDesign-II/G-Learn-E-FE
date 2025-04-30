import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.module.jsx';
import Dropdown from '../components/Dropdown.jsx';
import logoImageLight from '../assets/image-logo-light.png';
import SelectableButton from '../components/SelectableButton.jsx';
import { generateWorkbook } from '../api/Workbook.js';
import InformationPopup from '../components/common/InformationPopup.jsx'; // 경고 모달 컴포넌트

const ProblemGenerator = () => {
  const navigate = useNavigate();
  const submittingRef = useRef(false);
  // 파일 input refs
  const pdfInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [inputType, setInputType] = useState('text');
  const [content, setContent] = useState('');
  const [activeButton, setActiveButton] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('중');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [showTypeAlert, setShowTypeAlert] = useState(false);


  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  const [typeOptions, setTypeOptions] = useState({
    '객관식': { optionCount: 5, questionCount: 30, customQuestionCount: '' },
    'O/X 퀴즈': { questionCount: 5, customQuestionCount: '' },
    '주관식': { questionCount: 5, customQuestionCount: '' },
    '빈칸 채우기': { optionCount: 2, questionCount: 5, customQuestionCount: '' },
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
    '주관식': false,
    '빈칸 채우기': false,
  });

  const handlePdfChange = (e) => {
    const file = e.target.files[0] || null;
    setSelectedPdfFile(file);
  };
  const handleAudioChange = (e) => {
    const file = e.target.files[0] || null;
    setSelectedAudioFile(file);
  };

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

  const handleGenerateClick = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    if (selectedTypes.length === 0) {
      InformationPopup
      setShowTypeAlert(true);
      return;
    }

    setIsLoading(true);
    try {
      const newWorkbookId = await generateWorkbook({
        summaryText: content,
        pdfFile: selectedPdfFile,
        audioFile: selectedAudioFile,
        selectedTypes,
        typeOptions,
        difficulty: selectedDifficulty
      });
      navigate(`/private`);
    } catch (e) {
      console.error(e);
      // 에러 UI 처리
    } finally {
      setIsLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <>
      <Navbar />

      {showTypeAlert && (
        <InformationPopup
          message="문제 유형을 하나 이상 선택해주세요."
          onClose={() => setShowTypeAlert(false)}
        />
      )}
      {isLoading && (
        <div className="fixed top-20 left-0 w-screen h-[calc(100vh-80px)] bg-[#F3E9DC] z-[9999] flex items-center justify-center">
          <div className="text-center">
            <img src={logoImageLight} alt="G-Learn-E Logo" className="w-[350px] h-auto" />
            <p className="mt-6 text-xl text-[#B3977B] leading-relaxed font-[\'Noto Sans KR\']">
              문제를 생성하고 있어요!<br />잠시만 기다려주세요 <span className="dots"></span>
            </p>
          </div>
        </div>
      )}

      {/* ✅ 페이지 전체를 감싸는 컨테이너 */}
      <div className="mt-20 font-[\'Noto Sans KR\'] box-border">
        {/* ✅ 안내 메시지 + 입력 타입 버튼 섹션 */}
        <div className="bg-[rgba(243,233,220,0.5)] h-[260px] flex flex-col items-center justify-center gap-10 text-center">
          <h2 className="text-xl text-brown m-0">내용 입력 및 문제 유형을 선택한 후 문제를 생성해보세요!</h2>

          {/* ✅ 입력 타입 버튼 묶음 */}
          <div className="flex gap-[22px]">
          <SelectableButton
              label="T Text"
              isActive={inputType === 'text'}
              onClick={() => setInputType('text')}
            />
            <SelectableButton
              label="📄 PDF"
              isActive={inputType === 'pdf'}
              onClick={() => {
                setInputType('pdf');
                pdfInputRef.current.click();
              }}
            />
            <SelectableButton
              label="🎙️ 음성파일"
              isActive={inputType === 'voice'}
              onClick={() => {
                setInputType('voice');
                audioInputRef.current.click();
              }}
            />
          </div>

          {/* hidden inputs */}
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handlePdfChange}
          />
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleAudioChange}
          />
        </div>

        {/* 파일 미리보기 */}
        <div className="mt-4 p-4">
          {selectedPdfFile && (
            <div className="inline-block bg-[rgba(243,233,220,0.5)] px-3 py-1 rounded mr-2">
              📄 {selectedPdfFile.name}
            </div>
          )}
          {selectedAudioFile && (
            <div className="inline-block bg-[rgba(243,233,220,0.5)] px-3 py-1 rounded">
              🎙️ {selectedAudioFile.name}
            </div>
          )}
        </div>

        {/* ✅ 텍스트 입력 영역 */}
        <div className="flex justify-center p-12">
          <div className="relative">
            <textarea
              className="w-[90vw] max-w-[1360px] min-w-[320px] h-[60vh] max-h-[600px] border-[1.5px] border-lightbrown rounded-[1.5rem] p-5 text-base resize-none outline-none box-border shadow-[0_8px_30px_rgba(192,133,82,0.2)] font-[\'Noto Sans KR\']"
              placeholder="문제를 생성할 내용을 입력하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
            />
            {/* ✅ 글자 수 카운터 */}
            <div className="absolute bottom-20 right-5 text-sm text-gray-500 font-normal">{content.length} / 1000</div>
            {/* ✅ 하단의 컨트롤 버튼 */}
            <div className="absolute bottom-5 right-5 flex gap-[22px]">
              <SelectableButton
                label="문제 유형"
                isActive={activeButton === 'type'}
                onClick={() => setActiveButton(activeButton === 'type' ? null : 'type')}
              />

              <SelectableButton
                label="문제 생성"
                isActive={activeButton === 'generate'}
                onClick={handleGenerateClick}
              />
            </div>
          </div>
        </div>

        {/* ✅ 모달 전체 감싸는 영역 */}
        {activeButton === 'type' && (
          <div className="fixed top-0 left-0 w-screen h-screen bg-[rgba(60,60,60,0.5)] flex justify-center items-center z-[999]" onClick={closeModal}>
            <div className="w-[380px] bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative z-[1000]" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center text-[1.2rem]">
                <span>문제 유형</span>
                <button onClick={closeModal} className="bg-none border-none text-[1.2rem] cursor-pointer">✖</button>
              </div>

              {/* ✅ 모달 안쪽 내용 */}
              <div className="py-4">
                <ul className="list-none p-0 m-0">
                  {Object.keys(typeOptions).map((type, index) => {
                    const isActive = selectedTypes.includes(type);
                    return (
                      <li
                        key={type}
                        className={`flex items-center p-[0.6rem] rounded-[12px] cursor-pointer transition-colors duration-300 ${isActive ? 'bg-[rgba(243,233,220,0.5)] text-brown font-bold' : 'hover:bg-[#f5f5f5]'}`}
                        onClick={() => {
                          toggleTypeSelection(type);
                          toggleDropdown(type);
                        }}
                      >
                        <span className="w-6">{['🎯', '❓', '🗨️', '🧩'][index]}</span>
                        <span className="flex-1 ml-2">{type}</span>
                        {openDropdowns[type] && (
                          <div className="flex justify-between gap-4 my-2" onClick={(e) => e.stopPropagation()}>
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
                        {isActive && <span className="font-bold ml-5">✓</span>}
                      </li>
                    );
                  })}
                </ul>

                {/* 난이도 드롭다운 */}
                <div className="flex justify-between items-center py-6 my-6 border-t border-[#ccc]">
                  <span>난이도</span>
                  <select
                    value={selectedDifficulty}
                    onChange={handleDifficultyChange}
                    className="p-2 text-base border border-[#ccc] rounded-md cursor-pointer focus:outline-none focus:border-[#3ADBFF] hover:border-[#3ADBFF]"
                  >
                    <option value="상">상</option>
                    <option value="중">중</option>
                    <option value="하">하</option>
                  </select>
                </div>

                <button
                  className="w-full p-3 bg-brown text-white border-none rounded-full text-base font-bold cursor-pointer"
                  onClick={handleSave}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProblemGenerator;