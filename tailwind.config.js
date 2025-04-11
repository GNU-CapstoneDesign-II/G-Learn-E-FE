/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                // ✅ Vite 프로젝트면 이거 꼭 필요함!
    "./src/**/*.{js,ts,jsx,tsx}",  // ✅ src 아래 모든 컴포넌트 포함
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
