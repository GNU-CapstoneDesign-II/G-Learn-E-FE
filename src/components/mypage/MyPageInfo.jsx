// src/components/mypage/MyPageInfo.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import level from '../../assets/Level_Icon/level_0to10.png';
import arrow from '../../assets/dropbox_arrow.png';

/* ───────────────── 더미 데이터 ───────────────── */
const colleges = ['IT 공과대학', '인문대학', '경상대학'];
const departmentsByCollege = {
    'IT 공과대학': ['컴퓨터공학과', '정보통신공학과', '전자공학과'],
    인문대학: ['영어영문학과', '국어국문학과'],
    경상대학: ['경영학과', '경제학과'],
};

export default function MyPageInfo() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        name: '김수현',
        nickname: '김동팔',
        email: 'kes23529@gnu.ac.kr',
        college: 'IT 공과대학',
        department: '컴퓨터공학과',
    });
    const [form, setForm] = useState(userData);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [blockedAccount, setBlockedAccount] = useState(['안유진', '장원영', '카리나', '윈터', '백지헌', '안유진', '장원영', '카리나', '윈터', '백지헌', '안유진', '장원영', '카리나', '윈터', '백지헌']);
    const [unblockTarget, setUnblockTarget] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCollegeChange = (e) => {
        const newCollege = e.target.value;
        setForm(prev => ({
            ...prev,
            college: newCollege,
            department: departmentsByCollege[newCollege][0],
        }));
    };

    const onSaveClick = () => setShowConfirm(true);
    const onConfirmSave = () => {
        setUserData(form);
        setIsEditing(false);
        setShowConfirm(false);
    };
    const onCancelSave = () => setShowConfirm(false);

    const onUnblockClick = (username) => setUnblockTarget(username);
    const onConfirmUnblock = () => {
        setBlockedAccount(prev => prev.filter(u => u !== unblockTarget));
        setUnblockTarget(null);
    };
    const onCancelUnblock = () => setUnblockTarget(null);

    const border = 'border-2 border-[#b9a997]';
    const labelStyle = 'text-sm text-[#5F360A]/80 mb-1 ml-px';
    const inputCommon = `${border} rounded-xl w-full h-14 px-6 pr-12 flex items-center leading-none text-[#5F360A] placeholder:text-[#b9a997] focus:outline-none`;

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 relative">
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
                        <p className="mb-4 text-lg text-[#5F360A]">수정하시겠습니까?</p>
                        <div className="flex justify-around">
                            <button onClick={onCancelSave} className="px-4 py-2 border rounded-lg text-sm">취소</button>
                            <button onClick={onConfirmSave} className="px-4 py-2 bg-[#b9a997] text-white rounded-lg text-sm">확인</button>
                        </div>
                    </div>
                </div>
            )}

            {unblockTarget && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
                        <p className="mb-4 text-lg text-[#5F360A]">차단을 해제하시겠습니까?</p>
                        <div className="flex justify-around">
                            <button onClick={onCancelUnblock} className="px-4 py-2 border rounded-lg text-sm">취소</button>
                            <button onClick={onConfirmUnblock} className="px-4 py-2 bg-[#b9a997] text-white rounded-lg text-sm">확인</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-12">
                <aside className="w-full md:w-1/4 flex flex-col items-center text-center">
                    <h2 className="text-4xl font-bold text-[#5F360A] relative">
                        내 정보
                        <span className="block w-24 h-[3px] bg-[#5F360A] mx-auto mt-3" />
                    </h2>
                    <div className="mt-10 mb-8 w-60 h-60 rounded-full bg-[#f5f1eb] flex items-center justify-center">
                        <img src={level} alt="profile" className="w-36 h-auto object-contain" />
                    </div>
                    <p className="text-4xl font-bold text-[#5F360A]">{userData.name}</p>
                    <p className="mt-4 text-lg text-[#5F360A]/60 font-medium leading-snug">
                        {userData.college} - {userData.department}
                    </p>
                </aside>

                <section className="flex-1">
                    <div className="flex justify-end mb-6 min-h-[42px]">
                        {!isEditing ? (
                            <button onClick={() => { setForm(userData); setIsEditing(true); }} className="border border-[#b9a997] text-[#b9a997] rounded-lg py-1.5 px-6 text-sm">편집</button>
                        ) : (
                            <div className="flex gap-4">
                                <button onClick={() => setIsEditing(false)} className="w-10 h-10 flex items-center justify-center rounded-full border border-[#b9a997] text-[#b9a997] text-xl leading-none">×</button>
                                <button onClick={onSaveClick} className="border border-[#b9a997] bg-[#b9a997] text-white rounded-lg py-1.5 px-6 text-sm">수정 완료</button>
                            </div>
                        )}
                    </div>

                    <form className="space-y-6">
                        <FormField label="이름" readOnly={!isEditing} value={form.name} name="name" onChange={handleChange} inputClass={inputCommon} labelClass={labelStyle} />
                        <FormField label="닉네임" readOnly={!isEditing} value={form.nickname} name="nickname" onChange={handleChange} inputClass={inputCommon} labelClass={labelStyle} />
                        <div className="grid grid-cols-2 gap-6">
                            <FormSelect label="단과대학" readOnly={!isEditing} value={form.college} name="college" options={colleges} onChange={handleCollegeChange} inputClass={inputCommon} labelClass={labelStyle} />
                            <FormSelect label="학과" readOnly={!isEditing} value={form.department} name="department" options={departmentsByCollege[form.college]} onChange={handleChange} inputClass={inputCommon} labelClass={labelStyle} />
                        </div>
                        <ReadOnlyField label="email" value={userData.email} inputClass={inputCommon} labelClass={labelStyle} />
                    </form>

                    <button
                        type="button"
                        onClick={() => navigate('/find-password')}
                        className="w-full bg-[#b9a997] text-white rounded-xl py-5 mt-14 hover:bg-[#9f8267] transition-colors"
                    >
                        비밀번호 변경
                    </button>
                </section>

                <aside className="md:w-[380px] xl:w-[420px] shrink-0 h-[600px]">
                    <div className={`${border} rounded-3xl h-full p-8 flex flex-col overflow-hidden`}>
                        <h3 className="text-lg font-medium text-[#5F360A] mb-4">차단 유저</h3>
                        <div className="w-full h-px bg-[#b9a997] mb-6" />
                        {blockedAccount.length === 0 ? (
                            <p className="text-sm text-[#5F360A]/50 text-center">(현재 차단된 유저 없음)</p>
                        ) : (
                            <ul className="flex-1 overflow-y-auto space-y-4 scrollbar-thin
    scrollbar-thumb-[#b9a997]
    scrollbar-track-[#f5f1eb]
    scrollbar-thumb-rounded-lg
    scrollbar-track-rounded-lg">
                                {blockedAccount.map(user => (
                                    <li key={user} className="flex justify-between items-center h-12">
                                        <span className="text-[#5F360A]">{user}</span>
                                        {isEditing && (
                                            <button onClick={() => onUnblockClick(user)} className="text-sm text-[#5E3813] px-2 py-1 border border-[#5E3813] rounded-lg mr-3">
                                                해제
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}

function FormField({ label, readOnly, value, name, onChange, type = 'text', inputClass, labelClass }) {
    return (
        <div>
            <p className={labelClass}>{label}</p>
            {readOnly ? (
                <div className={`${inputClass} bg-transparent`}>{value}</div>
            ) : (
                <input type={type} name={name} value={value} onChange={onChange} className={inputClass} />
            )}
        </div>
    );
}

function FormSelect({ label, readOnly, value, name, options, onChange, inputClass, labelClass }) {
    return (
        <div>
            <p className={labelClass}>{label}</p>
            <div className="relative">
                <select name={name} value={value} onChange={onChange} className={`${inputClass} appearance-none pr-12 text-[#5F360A] ${readOnly ? 'pointer-events-none bg-transparent' : 'bg-white'}`}>
                    {options.map(o => (
                        <option key={o} className="text-[#5F360A]">{o}</option>
                    ))}
                </select>
                {!readOnly && (
                    <img src={arrow} alt="dropdown arrow" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                )}
            </div>
        </div>
    );
}

function ReadOnlyField({ label, value, inputClass, labelClass }) {
    return (
        <div>
            <p className={labelClass}>{label}</p>
            <div className={`${inputClass} bg-transparent`}>{value}</div>
        </div>
    );
}
