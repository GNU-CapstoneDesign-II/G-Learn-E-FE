// 비밀번호 규칙 (8자 이상, 영문, 숫자, 특수문자 모두 포함)
const PWD_RULE = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+|~=`{}\[\]:;"'<>,.?/-])[A-Za-z\d!@#$%^&*()_+|~=`{}\[\]:;"'<>,.?/-]{8,}$/;

// 오류 메시지
const ERROR_MESSAGES = {
    WHITESPACE: "비밀번호에는 공백을 포함할 수 없습니다.",
    INVALID_RULE: "비밀번호는 8자 이상, 영문, 숫자, 특수문자를 모두 포함해야 합니다.",
    NO_MATCH: "비밀번호가 일치하지 않습니다.",
};

/**
 * 비밀번호 유효성을 검사하고 오류 메시지를 반환하는 함수 (제출용)
 * @param {object} params - 비밀번호와 비밀번호 확인 값
 * @param {string} params.password - 검사할 비밀번호
 * @param {string} params.passwordConfirm - 확인할 비밀번호
 * @returns {string|null} 오류 메시지 또는 null
 */
export function validatePassword({ password, passwordConfirm }) {
    if (/\s/.test(password)) {
        return ERROR_MESSAGES.WHITESPACE;
    }
    if (!PWD_RULE.test(password)) {
        return ERROR_MESSAGES.INVALID_RULE;
    }
    if (password !== passwordConfirm) {
        return ERROR_MESSAGES.NO_MATCH;
    }
    return null; // 모든 검증 통과
}

/**
 * 비밀번호 규칙만 실시간으로 검사하는 함수 (입력용)
 * @param {object} params - 비밀번호 값
 * @param {string} params.password - 검사할 비밀번호
 * @returns {string|null} 오류 메시지 또는 null
 */
export function validatePasswordRule({ password }) {
    if (/\s/.test(password)) {
        return ERROR_MESSAGES.WHITESPACE;
    }
    // 값이 있을 때만 규칙을 검사
    if (password && !PWD_RULE.test(password)) {
        return ERROR_MESSAGES.INVALID_RULE;
    }
    return null;
}

