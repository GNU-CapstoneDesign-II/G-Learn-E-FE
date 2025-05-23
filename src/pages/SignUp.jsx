// src/pages/SignUp.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import InformationPopup from "../components/common/InformationPopup.jsx";
import {
  issueEmailAuthCode,
  verifyEmailAuthCode,
  signup,
} from "../api/authApi.js";
import { getCollegesWith, getDepartments } from "../api/workbookApi.js";
import { nav } from "framer-motion/client";

export default function SignUp() {
  /* ─────────────────── state ─────────────────── */
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: "",
    collegeId: "",
    departmentId: "",
  });
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const deptCache = useRef({});            // 학과 캐시
  const [timeLeft, setTimeLeft] = useState(0);   // ← 6 분(360 초) 타이머
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const pwd = form.password;
  const pwdRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  /* ─────────────────── 인증 관련 ─────────────────── */
  const [emailSent, setEmailSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [signupToken, setSignupToken] = useState("");
  const [error, setError] = useState("");

  /* ─────────────────── UI: 팝업 ─────────────────── */
  const [popup, setPopup] = useState({ open: false, msg: "" });
  const openPopup = (msg) => setPopup({ open: true, msg });
  const closePopup = () => {
    setPopup({ open: false, msg: "" });
    if (shouldNavigate) {
      setShouldNavigate(false);
      navigate("/login");
    }
  };

  /* ─────────────────── 단과대/학과 로드 ─────────────────── */
  useEffect(() => {
    getCollegesWith(true)
      .then((res) => setColleges(res.data.data))
      .catch(console.error);
  }, []);

  const fetchDepartments = async (collegeId) => {
    if (deptCache.current[collegeId]) {
      setDepartments(deptCache.current[collegeId]);
      return;
    }
    try {
      const res = await getDepartments(collegeId);
      deptCache.current[collegeId] = res.data.data;
      setDepartments(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  // ─── 타이머 useEffect ───
  useEffect(() => {
    if (!emailSent) return;
    if (timeLeft <= 0) {
      setEmailSent(false);      // 만료 → 재요청 필요
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [emailSent, timeLeft]);

  /* ─────────────────── form 핸들러 ─────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      if (!pwdRule.test(value)) {
        setError("비밀번호는 최소 8자, 영문+숫자 포함");
      } else {
        setError("");
      }
    }
  };

  const handleCollegeChange = async (e) => {
    const collegeId = Number(e.target.value);
    setForm((prev) => ({ ...prev, collegeId, departmentId: "" }));
    await fetchDepartments(collegeId);
  };

  /* ─────────────────── 이메일 인증 ─────────────────── */
  const handleSendCode = async () => {
    if (!form.email) {
      openPopup("이메일을 입력해주세요.");
      return;
    }
    try {
      setError("");
      await issueEmailAuthCode(form.email);
      setEmailSent(true);
      setVerified(false);
      setTimeLeft(360);
      openPopup("인증 메일이 전송되었습니다!");
    } catch (err) {
      setError(err.response?.data?.message || "인증 메일 전송에 실패했습니다.");
    }
  };

  const handleVerify = async () => {
    if (!emailSent) {
      setError("❗ 인증이 진행되지 않았습니다.");
      return;
    }
    try {
      setError("");
      const code = form.verifyCode || "";
      const res = await verifyEmailAuthCode(form.email, code);
      setSignupToken(res.data.data.emailAuthToken);
      setVerified(true);
      setTimeLeft(0);
      openPopup("인증이 완료되었습니다!");
    } catch (err) {
      setError(err.response?.data?.message || "인증 코드 검증에 실패했습니다.");
      setVerified(false);
    }
  };

  /* ─────────────────── 회원가입 ─────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) {
      setError("❗ 이메일 인증을 완료해주세요.");
      return;
    }

    if (!pwdRule.test(pwd)) {
      setError("❗ 비밀번호는 최소 8자 이상, 영문자와 숫자를 각각 1개 이상 포함해야 합니다.");
      return;
    }

    if (form.password !== form.passwordConfirm) {
      setError("❗ 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!form.collegeId || !form.departmentId) {
      setError("❗ 단과대학과 학과를 모두 선택해주세요.");
      return;
    }

    try {
      setError("");
      await signup(
        form.name,
        form.nickname,
        form.email,
        form.password,
        form.collegeId,
        form.departmentId,
        signupToken,
      );
      openPopup("회원가입이 완료되었습니다!");
      setShouldNavigate(true);
      // TODO: 필요 시 로그인 페이지 이동
    } catch (err) {
      setError(err.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };

  /* ─────────────────── 렌더 ─────────────────── */
  return (
    <>
      <Navbar />
      {popup.open && <InformationPopup message={popup.msg} onClose={closePopup} />}

      <div className="pt-40 pb-40 min-h-screen bg-[#f8f1e7] text-[#5F360A] py-10 px-4">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold border-b-2 border-[#5F360A] inline-block pb-1 mb-4">회원가입</h1>
          <p className="text-sm text-[#9A7E5F] leading-relaxed mb-10">
            회원 가입을 하시면 <strong>지런이</strong>의 서비스를 이용 하실 수 있습니다.
            <br />지런이는 여러분의 여정을 항상 응원합니다.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
            {/* 이름 */}
            <InputField label="이름" name="name" value={form.name} onChange={handleChange} />

            {/* 닉네임 */}
            <InputField label="닉네임" name="nickname" value={form.nickname} onChange={handleChange} />

            {/* 단과대학 & 학과 */}
            <div>
              <label className="block text-sm mb-1">소속 대학 및 학과</label>
              <div className="flex gap-2">
                <SelectField
                  placeholder="단과대학"
                  value={form.collegeId}
                  options={colleges.map((c) => ({ value: c.id, label: c.collegeName }))}
                  onChange={handleCollegeChange}
                />
                <SelectField
                  placeholder="학과"
                  value={form.departmentId}
                  options={departments.map((d) => ({ value: d.id, label: d.departmentName }))}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, departmentId: Number(e.target.value) }))
                  }
                  disabled={!form.collegeId}
                />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm mb-1">이메일</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="학교 이메일"
                  className="flex-1 border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="bg-[#AC957B] text-white text-sm px-3 py-2 rounded hover:bg-[#5F360A]"
                >
                  인증코드 전송
                </button>
              </div>
              <input
                type="text"
                name="verifyCode"
                onChange={handleChange}
                placeholder="인증코드 입력"
                className="mt-3 w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
              />
              {emailSent && !verified && (
                <p className="mt-1 text-sm text-red-600">
                  {`${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`}
                </p>
              )}
              <button
                type="button"
                onClick={handleVerify}
                className="mt-2 w-full bg-[#AC957B] text-white py-2 rounded hover:bg-[#5F360A]"
              >
                인증 확인
              </button>
            </div>

            {/* 비밀번호 */}
            <InputField
              label="비밀번호"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <InputField
              label="비밀번호 확인"
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* 제출 */}
            <button
              type="submit"
              className="w-full bg-[#AC957B] text-white py-2 rounded mt-2 hover:bg-[#5F360A]"
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

/* ─────────────────── 재사용 컴포넌트 ─────────────────── */
function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="w-full border border-[#5F360A] px-4 py-2 rounded focus:outline-none"
      />
    </div>
  );
}

function SelectField({ placeholder, value, options, onChange, disabled }) {
  return (
    <div className="relative flex-1">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`appearance-none w-full border border-[#5F360A] bg-white px-4 py-2 pr-10 rounded focus:outline-none
        ${value === "" ? "text-gray-400" : "text-[#5F360A]"} ${disabled && "bg-[#f1ece6]"}`}
      >
        <option disabled value="">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-[#5F360A]">
            {o.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#5F360A]">
        ▼
      </div>
    </div>
  );
}
