/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'b-light': 'rgb(236, 13%, 77%)', //--border-color: 236 13% 77%;
      }
    },
  },
  plugins: [],
};
