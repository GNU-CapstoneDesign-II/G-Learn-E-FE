/** @type {import('tailwindcss').Config} */
// <<<<<<< HEAD
// module.exports = {
//   content: [
//     "./index.html",                // ✅ Vite 프로젝트면 이거 꼭 필요함!
//     "./src/**/*.{js,ts,jsx,tsx}",  // ✅ src 아래 모든 컴포넌트 포함
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
// =======
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightbrown: "#C08552",
        brown: "#895737",
        darkbrown: "#5F360A",
      }
    }
  },
  plugins: [],
}
// >>>>>>> develop
