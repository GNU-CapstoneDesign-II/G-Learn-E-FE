// src/components/popupConstants.js

export const SEMESTER_OPTIONS = [
  { value: "SPRING", label: "1학기" },
  { value: "FALL",   label: "2학기" },
  { value: "SUMMER", label: "여름계절학기" },
  { value: "WINTER", label: "겨울계절학기" },
  { value: "OTHER",  label: "기타" },
];

export const SEMESTER_LABELS = SEMESTER_OPTIONS.reduce((o, {value, label}) => {
  o[value] = label;
  return o;
}, {});

export const EXAM_TYPE_OPTIONS = [
  { value: "ALL",    label: "전체"    },
  { value: "MIDDLE", label: "중간고사" },
  { value: "FINAL",  label: "기말고사" },
  { value: "OTHER",  label: "기타"     },
];

export const EXAM_TYPE_LABELS = EXAM_TYPE_OPTIONS.reduce((o, {value, label}) => {
  o[value] = label;
  return o;
}, {});
