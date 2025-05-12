// src/components/mypage/MyPageInfo.jsx
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import { getCollegesWith, getDepartments } from "../../api/workbookApi.js";
import { updateUserInfo } from "../../api/userApi";
import { changePassword } from "../../api/authApi.js";
import LevelIcon from "../common/LevelIcon.jsx";

import arrow from "../../assets/dropbox_arrow.png";
import ConfirmModal from "../common/ConfirmModal.jsx";
import InformationPopup from "../common/InformationPopup.jsx";


// /* ───────────────── 더미 데이터 ───────────────── */
// const colleges = ['IT 공과대학', '인문대학', '경상대학'];
// const departmentsByCollege = {
//     'IT 공과대학': ['컴퓨터공학과', '정보통신공학과', '전자공학과'],
//     인문대학: ['영어영문학과', '국어국문학과'],
//     경상대학: ['경영학과', '경제학과'],
// };

export default function MyPageInfo() {
    const { user, login } = useAuth();          // login: 프로필 재동기화를 위해 사용
    const navigate = useNavigate();

    const [colleges, setColleges] = useState([]);
    const [departments, setDepartments] = useState([]);
    const deptCache = useRef({});
    const [loadingCol, setLoadingCol] = useState(true);
    const [loadingDep, setLoadingDep] = useState(false);

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [blockedAccount, setBlockedAccount] = useState(['안유진', '장원영', '카리나', '윈터', '백지헌']);
    const [unblockTarget, setUnblockTarget] = useState(null);

    useEffect(() => {
        // 1) 단과대학 목록
        getCollegesWith(true)
            .then(res => setColleges(res.data.data))
            .catch(console.error)
            .finally(() => setLoadingCol(false));
    }, []);

    // user.collegeId 변경될 때 학과 목록 갱신
    const fetchDepartments = async (collegeId) => {
        // 이미 캐시된 단과대는 재요청 건너뜀
        if (deptCache.current[collegeId]) {
            setDepartments(deptCache.current[collegeId]);
            return;
        }
        setLoadingDep(true);
        try {
            const res = await getDepartments(collegeId);
            deptCache.current[collegeId] = res.data.data;   // 캐시에 저장
            setDepartments(res.data.data);
        } finally {
            setLoadingDep(false);
        }
    };

    useEffect(() => {
        if (user?.college?.id) fetchDepartments(user.college.id);
    }, [user?.college?.id]);

    const [form, setForm] = useState(null); // { name, nickname, collegeId, departmentId }
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [info, setInfo] = useState({ open: false, msg: '' });

    const loadForm = async () => {
        setForm({
            name: user.name,
            nickname: user.nickname,
            collegeId: user.college.id,
            departmentId: user.department.id,
            email: user.email,
        });
        await fetchDepartments(user.college.id);
    };


    useEffect(() => {
        if (!user) return;          // user가 준비된 뒤 한 번만 실행
        setForm({
            name: user.name,
            nickname: user.nickname,
            collegeId: user.college.id,
            departmentId: user.department.id,
            email: user.email,
        });
    }, [user]);

    if (!user || !form) return null;   // form 세팅될 때까지 렌더 건너뜀



    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCollegeChange = async (e) => {
        const newCollegeId = Number(e.target.value);
        setForm((prev) => ({ ...prev, collegeId: newCollegeId, departmentId: "" }));
        await fetchDepartments(newCollegeId);
    };

    const handleConfirmSave = async () => {
        try {
            await updateUserInfo({
                name: form.name,
                nickname: form.nickname,
                collegeId: form.collegeId,
                departmentId: form.departmentId,
            });
            await login();           // AuthContext 내 프로필을 최신화
            setIsEditing(false);
            setShowConfirm(false);
            setInfo({ open: true, msg: '수정이 완료되었습니다.' });
        } catch (e) {
            console.error(e);
            setInfo({ open: true, msg: '수정 중 오류가 발생했습니다.' });
        }
    };

    const onUnblockClick = (username) => setUnblockTarget(username);
    const onConfirmUnblock = () => {
        setBlockedAccount(prev => prev.filter(u => u !== unblockTarget));
        setUnblockTarget(null);
    };
    const onCancelUnblock = () => setUnblockTarget(null);



    const handleStartPasswordChange = () => {
        setIsChangingPassword(true);
        setPasswordError("");
    };
    const handleCancelPasswordChange = () => {
        setIsChangingPassword(false);
        setOldPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
        setPasswordError("");
    };
    const handlePasswordSubmit = async () => {
        if (newPassword !== newPasswordConfirm) {
            setPasswordError("새 비밀번호가 일치하지 않습니다.");
            return;
        }
        try {
            await changePassword(oldPassword, newPassword, newPasswordConfirm);
            setIsChangingPassword(false);
            setOldPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
            setInfo({ open: true, msg: "비밀번호가 변경되었습니다." });
        } catch (err) {
            setPasswordError(err.response?.data?.message || "비밀번호 변경에 실패했습니다.");
        }
    };


    const border = 'border-2 border-[#b9a997]';
    const labelStyle = 'text-sm text-[#5F360A]/80 mb-1 ml-px';
    const inputCommon = `${border} rounded-xl w-full h-14 px-6 pr-12 flex items-center leading-none text-[#5F360A] placeholder:text-[#b9a997] focus:outline-none`;

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 relative">
            {showConfirm && (
                <ConfirmModal
                    message="변경 사항을 저장하시겠습니까?"
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={handleConfirmSave}
                />
            )}
            {info.open && (
                <InformationPopup
                    message={info.msg}
                    onClose={() => setInfo({ open: false, msg: '' })}
                />
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
                        <LevelIcon level={user.level} size={80} />
                    </div>
                    <p className="text-4xl font-bold text-[#5F360A]">{user.name}</p>
                    <p className="mt-4 text-lg text-[#5F360A]/60 font-medium leading-snug">
                        {user.college.collegeName} - {user.department.departmentName}
                    </p>
                </aside>

                <section className="flex-1">
                    <div className="flex justify-end mb-6 min-h-[42px]">
                        {!isEditing ? (
                            <button onClick={() => { loadForm(user); setIsEditing(true); }} className="border border-[#b9a997] text-[#b9a997] rounded-lg py-1.5 px-6 text-sm">편집</button>
                        ) : (
                            <div className="flex gap-4">
                                <button onClick={() => { loadForm(); setIsEditing(false); }} className="w-10 h-10 flex items-center justify-center rounded-full border border-[#b9a997] text-[#b9a997] text-xl leading-none">×</button>
                                <button onClick={() => setShowConfirm(true)} className="border border-[#b9a997] bg-[#b9a997] text-white rounded-lg py-1.5 px-6 text-sm">수정 완료</button>
                            </div>
                        )}
                    </div>

                    <form className="space-y-6">


                        <div className="grid grid-cols-2 gap-6">
                            <FormField label="이름" readOnly={!isEditing} value={form.name} name="name" onChange={handleChange} inputClass={inputCommon} labelClass={labelStyle} />
                            <FormField label="닉네임" readOnly={!isEditing} value={form.nickname} name="nickname" onChange={handleChange} inputClass={inputCommon} labelClass={labelStyle} />
                        </div>
                        <FormSelect
                            label="단과대학"
                            readOnly={!isEditing}
                            value={form.collegeId}
                            name="collegeId"
                            options={colleges.map(c => ({ value: c.id, label: c.collegeName }))}
                            onChange={handleCollegeChange}
                            inputClass={inputCommon}
                            labelClass={labelStyle}
                        />
                        <FormSelect
                            label="학과"
                            readOnly={!isEditing}
                            value={form.departmentId}
                            name="departmentId"
                            options={departments.map(d => ({ value: d.id, label: d.departmentName }))}
                            onChange={handleChange}
                            inputClass={inputCommon}
                            labelClass={labelStyle}
                        />

                        <ReadOnlyField label="email" value={form.email} inputClass={inputCommon} labelClass={labelStyle} />
                    </form>

                    {!isChangingPassword ? (
                        <button
                            type="button"
                            onClick={handleStartPasswordChange}
                            className="w-full bg-[#b9a997] text-white rounded-xl py-5 mt-14 hover:bg-[#9f8267] transition-colors"
                        >
                            비밀번호 변경
                        </button>
                    ) : (
                        <div className="space-y-4 mt-6">
                            <input
                                type="password"
                                placeholder="현재 비밀번호"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                            />
                            <input
                                type="password"
                                placeholder="새 비밀번호"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                            />
                            <input
                                type="password"
                                placeholder="새 비밀번호 확인"
                                value={newPasswordConfirm}
                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                                className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                            />
                            {passwordError && (
                                <p className="text-sm text-red-500">{passwordError}</p>
                            )}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={handlePasswordSubmit}
                                    className="flex-1 bg-[#b9a997] text-white rounded-xl py-3 hover:bg-[#9f8267]"
                                >
                                    저장
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelPasswordChange}
                                    className="flex-1 border border-[#b9a997] text-[#b9a997] rounded-xl py-3 hover:bg-[#b9a997]/20"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    )}
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
                        <option
                            key={o.value}      // 고유 id
                            value={o.value}
                            className="text-[#5F360A]"
                        >
                            {o.label}
                        </option>
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
