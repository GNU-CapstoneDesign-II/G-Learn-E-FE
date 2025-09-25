module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 혹시 src 폴더가 없다면 "./**/*.jsx"로
  ],
  theme: {
    extend: {
      colors: {
        brown1: '#FFE8D6',
        brown2: '#DDA15E',
        brown3: '#BC6C25',
        brown4: '#964B24',
        brown5: '#6F4E37',
        brown6: '#5e3813',

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