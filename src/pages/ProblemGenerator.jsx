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
  const [summaryText, setSummaryText] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [isPDFPopupOpen, setIsPDFPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const [selectedTypes, setSelectedTypes] = useState(DEFAULT_SELECTED_TYPES);
  const [typeOptions, setTypeOptions] = useState(DEFAULT_TYPE_OPTIONS);
  const [openDropdowns, setOpenDropdowns] = useState({
    '객관식': false,
    'O/X 퀴즈': false,
    '주관식': false,
    '빈칸 채우기': false,
  });
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

  // ⭐️ 문제 유형 모달 열 때 무조건 초기화
  const openTypeModal = () => {
    setSelectedTypes(DEFAULT_SELECTED_TYPES);
    setTypeOptions(DEFAULT_TYPE_OPTIONS);
    setOpenDropdowns({
      '객관식': false,
      'O/X 퀴즈': false,
      '주관식': false,
      '빈칸 채우기': false,
    });
    setSelectedDifficulty('중');
    setActiveButton('type');
  };

  // ⭐️ 모달 닫기 (복원 없이 그냥 닫기)
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
            <p className="mt-6 text-xl text-[#B3977B] leading-relaxed font-['Noto Sans KR']">
              문제를 생성하고 있어요!<br />잠시만 기다려주세요 <span className="dots"></span>
            </p>
          </div>
        </div>
      )}

      <div className="mt-20 font-['Noto Sans KR'] box-border">
        <div className="bg-[rgba(243,233,220,0.5)] h-[260px] flex flex-col items-center justify-center gap-10 text-center">
          <h2 className="text-xl text-brown m-0">
            내용 입력 및 문제 유형을 선택한 후 문제를 생성해보세요!
          </h2>

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

        <div className="flex justify-center p-12">
          <div className="relative w-[90vw] max-w-[1360px] min-w-[320px] h-[60vh] max-h-[600px] border-[1.5px] border-lightbrown rounded-[1.5rem] p-5 box-border shadow-[0_8px_30px_rgba(192,133,82,0.2)] bg-white">
            {pdfFile && (
              <div className="mb-3 inline-flex items-center bg-[rgba(243,233,220,0.5)] border border-lightbrown rounded-full px-4 py-1 text-darkbrown font-medium text-sm shadow-sm">
                <span className="truncate max-w-[200px]">{pdfFile.name}</span>
                <button
                  onClick={clearPDFFile}
                  className="ml-2 text-[1rem] text-gray-500 hover:text-red-500 focus:outline-none"
                >
                  ✖
                </button>
              </div>
            )}

            <textarea
              className="w-full h-[calc(100%-5rem)] text-base resize-none outline-none bg-transparent"
              placeholder="문제를 생성할 내용을 입력하세요..."
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              maxLength={1000}
            />

            <div className="absolute bottom-20 right-8 text-sm text-gray-500 font-normal">
              {summaryText.length} / 1000
            </div>

            <div className="absolute bottom-5 right-5 flex gap-[22px]">
              <SelectableButton
                label="문제 유형"
                isActive={activeButton === 'type'}
                onClick={openTypeModal}
              />
              <SelectableButton
                label="문제 생성"
                isActive={activeButton === 'generate'}
                onClick={handleGenerateClick}
              />
            </div>
          </div>
        </div>

        {activeButton === 'type' && (
          <div className="fixed top-0 left-0 w-screen h-screen bg-[rgba(60,60,60,0.5)] flex justify-center items-center z-[999]" onClick={closeModal}>
            <div className="w-[380px] bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative z-[1000]" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center text-[1.2rem]">
                <span>문제 유형</span>
                <button onClick={closeModal} className="text-[1.2rem] cursor-pointer">✖</button>
              </div>

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