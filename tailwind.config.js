module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 혹시 src 폴더가 없다면 "./**/*.jsx"로
  ],
  theme: {
    extend: {
      colors: {
        brown1: '#f4e5d3',
        brown2: '#e6c8a7',
        brown3: '#C78C5E',
        brown4: '#8A5A35',
        brown5: '#5C3B28',

        white: '#FFFFFF',
        grey1: '#D5D5D5',
        grey2: '#AAAAAA',
        grey3: '#808080',
        grey4: '#555555',
        grey5: '#2B2B2B',
        black: '#000000',
      },
      fontFamily: {
        namdhinggo: ['"Namdhinggo"', 'serif'],
      },
    }
  },
  plugins: [],
}