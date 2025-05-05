module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 혹시 src 폴더가 없다면 "./**/*.jsx"로
  ],
  theme: {
    extend: {
      colors: {
        lightbrown: "#C08552",
        brown: "#895737",
        darkbrown: "#5F360A",
      },
      fontFamily: {
        namdhinggo: ['"Namdhinggo"', 'serif'],
      },
    }
  },
  plugins: [],
}
