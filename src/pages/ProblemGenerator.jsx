import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Dropdown from '../components/ProblemGenerator/Dropdown.jsx';
import logoImageLight from '../assets/image-logo-light.png';
import SelectableButton from '../components/ProblemGenerator/SelectableButton.jsx';
import { generateWorkbook } from '../api/Workbook.js';
import InformationPopup from '../components/common/InformationPopup.jsx';
import FileUploadModal from '../components/ProblemGenerator/FileUploadModal.jsx';

const ProblemGenerator = () => {
  const navigate = useNavigate();
  const submittingRef = useRef(false);
  const [inputType, setInputType] = useState('text');
  const [content, setContent] = useState('');
  const [activeButton, setActiveButton] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('중');
  const [isLoading, setIsLoading] = useState(false);  // 로딩
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [showTypeAlert, setShowTypeAlert] = useState(false);
  const [isPDFPopupOpen, setIsPDFPopupOpen] = useState(false);
  const [isAudioPopupOpen, setIsAudioPopupOpen] = useState(false);

  const [typeOptions, setTypeOptions] = useState({
    객관식: { optionCount: 4, questionCount: 5, customQuestionCount: '' },
    'O/X 퀴즈': { questionCount: 5, customQuestionCount: '' },
    주관식: { questionCount: 5, customQuestionCount: '' },
    '빈칸 채우기': { optionCount: 2, questionCount: 5, customQuestionCount: '' },
  });

  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  const handleGenerateClick = async () => {
    if (selectedTypes.length === 0) {
      setShowTypeAlert(true);
      return;
    }
    if (submittingRef.current) return;

    submittingRef.current = true;
    setIsLoading(true);
    try {
      await generateWorkbook({
        summaryText: content,
        pdfFile: selectedPdfFile,
        audioFile: selectedAudioFile,
        selectedTypes,
        difficulty: selectedDifficulty,
      });
      navigate(`/private`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      submittingRef.current = false;
    }
  };

  const toggleTypeSelection = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleDropdown = (type) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const updateTypeOption = (type, field, value) => {
    setTypeOptions((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };

  const handleSave = () => {
    if (selectedTypes.length === 0) {
      setShowTypeAlert(true);
      return;
    }
    setActiveButton(null);
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
      {isPDFPopupOpen && (
        <FileUploadModal
          fileType="pdf"
          onClose={() => setIsPDFPopupOpen(false)}
          onFileSelect={(file) => {
            setSelectedPdfFile(file);
            setIsPDFPopupOpen(false);
          }}
        />
      )}
      {isAudioPopupOpen && (
        <FileUploadModal
          fileType="audio"
          onClose={() => setIsAudioPopupOpen(false)}
          onFileSelect={(file) => {
            setSelectedAudioFile(file);
            setIsAudioPopupOpen(false);
          }}
        />
      )}
      {isLoading && (
        <div className="fixed inset-x-0 top-[65px] bottom-0 bg-[#F3E9DC] z-[9999] flex items-center justify-center">
          <div className="text-center px-4">
            <img
              src={logoImageLight}
              alt="G-Learn-E Logo"
              className="w-full max-w-[350px] h-auto"
            />
            <p className="mt-6 text-xl text-[#B3977B] leading-relaxed font-['Noto Sans KR']">
              문제를 생성하고 있어요!<br />잠시만 기다려주세요 <span className="dots"></span>
            </p>
          </div>
        </div>
      )}

      <div className="pt-[65px] font-['Noto Sans KR'] box-border">
        <div className="bg-[rgba(243,233,220,0.5)] h-[260px] flex items-center justify-center text-center">
          <div className="flex flex-col items-center gap-10 px-4 md:px-6">
            <h2 className="text-lg md:text-xl text-brown m-0">
              내용 입력 및 문제 유형을 선택한 후 문제를 생성해보세요!
            </h2>
            <div className="flex gap-[24px]">
              <SelectableButton label="T Text" isActive={inputType === 'text'} onClick={() => setInputType('text')} />
              <SelectableButton label="📄 PDF" isActive={inputType === 'pdf'} onClick={() => { setInputType('pdf'); setIsPDFPopupOpen(true); }} />
              <SelectableButton label="🎙️ 음성파일" isActive={inputType === 'voice'} onClick={() => { setInputType('voice'); setIsAudioPopupOpen(true); }} />
            </div>
          </div>
        </div>

        <div className="flex justify-center p-12">
          <div className="w-[90vw] max-w-[1360px] min-w-[320px] h-[60vh] max-h-[600px] border-[1.5px] border-lightbrown rounded-[1.5rem] p-5 box-border shadow-[0_8px_30px_rgba(192,133,82,0.2)] bg-white font-['Noto Sans KR'] flex flex-col">
            <div className="relative flex-1 p-4 pb-28 flex flex-col gap-3">
              {(selectedPdfFile || selectedAudioFile) && (
                <div className="space-y-2">
                  {selectedPdfFile && (
                    <div className="flex items-center gap-2 bg-[rgba(243,233,220,0.5)] border border-lightbrown rounded-lg px-4 py-[10px] text-darkbrown font-semibold text-sm shadow-md w-fit max-w-full">
                      <span className="truncate max-w-[200px]">{selectedPdfFile.name}</span>
                      <button
                        onClick={() => setSelectedPdfFile(null)}
                        className="ml-1 text-sm text-gray-500 hover:text-red-500 transition"
                        title="PDF 파일 제거"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  {selectedAudioFile && (
                    <div className="flex items-center gap-2 bg-[rgba(243,233,220,0.5)] border border-lightbrown rounded-lg px-4 py-[10px] text-darkbrown font-semibold text-sm shadow-md w-fit max-w-full">
                      <span className="truncate max-w-[200px]">{selectedAudioFile.name}</span>
                      <button
                        onClick={() => setSelectedAudioFile(null)}
                        className="ml-1 text-sm text-gray-500 hover:text-red-500 transition"
                        title="음성 파일 제거"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}

              <textarea
                className="w-full flex-1 text-base leading-relaxed resize-none outline-none rounded-lg"
                placeholder="문제를 생성할 내용을 입력하세요..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); // 줄 바꿈 막기
                  }
                }}
                maxLength={1000}
              />
              <div className="absolute bottom-20 right-4 text-sm text-gray-500 font-normal">
                {content.length} / 1000
              </div>
              <div className="absolute bottom-4 right-4 flex gap-6">
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
        </div>
      </div>

      {/* ✅ 문제 유형 모달 */}
      {activeButton === 'type' && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-[rgba(60,60,60,0.5)] flex justify-center items-center z-[999]"
          onClick={() => setActiveButton(null)}
        >
          <div
            className="w-[380px] bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] relative z-[1000]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex justify-between items-center text-lg md:text-xl">
              <span>문제 유형</span>
              <button
                onClick={() => setActiveButton(null)}
                className="text-gray-500 text-lg md:text-xl hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 문제 유형 리스트만 감싸기 */}
            <div className="py-4">
              <ul className="list-none p-0 m-0 space-y-1">
                {Object.keys(typeOptions).map((type, index) => {
                  const isActive = selectedTypes.includes(type);
                  return (
                    <li
                      key={type}
                      className={`flex items-center p-[0.6rem] rounded-[12px] cursor-pointer transition-colors duration-300 ${
                        isActive
                          ? 'bg-[rgba(243,233,220,0.5)] text-brown font-bold'
                          : 'hover:bg-[#f5f5f5]'
                      }`}
                      onClick={() => {
                        toggleTypeSelection(type);
                        toggleDropdown(type);
                      }}
                    >
                      <span>{['🎯', '❓', '🗨️', '🧩'][index]}</span>
                      <span className="flex-1 ml-1">{type}</span>

                      {openDropdowns[type] && (
                        <div
                          className="flex justify-between gap-4 my-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {'optionCount' in typeOptions[type] && (
                            <Dropdown
                              label={
                                type === '빈칸 채우기' ? '빈칸 수' : '선지 수'
                              }
                              options={[1, 2, 3, 4, 5]}
                              value={typeOptions[type].optionCount}
                              onChange={(e) =>
                                updateTypeOption(
                                  type,
                                  'optionCount',
                                  e.target.value
                                )
                              }
                            />
                          )}
                          <Dropdown
                            label="질문 수"
                            options={[5, 10, 15, 30, 'custom']}
                            value={typeOptions[type].questionCount}
                            onChange={(e) =>
                              updateTypeOption(
                                type,
                                'questionCount',
                                e.target.value
                              )
                            }
                            customValue={typeOptions[type].customQuestionCount}
                            onCustomChange={(e) =>
                              updateTypeOption(
                                type,
                                'customQuestionCount',
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}

                      {isActive && <span className="font-bold ml-2">✓</span>}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 난이도 + 저장 (경계선 유지, 버튼 아래 여백 없음) */}
            <div className="pt-4 border-t border-[#ccc]">
              <div className="flex justify-between items-center mb-8">
                <span>난이도</span>
                <select
                  value={selectedDifficulty}
                  onChange={handleDifficultyChange}
                  className="p-2 text-base border border-[#ccc] rounded-md cursor-pointer focus:outline-none focus:border-[#3ADBFF] hover:border-[#3ADBFF]"
                >
                  <option value="상">어려움</option>
                  <option value="중">보통</option>
                  <option value="하">쉬움</option>
                </select>
              </div>
              <button
                className="w-full p-3 bg-brown text-white rounded-full text-base font-bold cursor-pointer"
                onClick={handleSave}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProblemGenerator;