/** @type {import('tailwindcss').Config} */
export default {
  // 1. Diga ao Tailwind onde procurar por classes
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    // 2. (Opcional) Podemos estender o tema aqui
    extend: {
      colors: {
        'ufc-green': '#005a3b', // Cor da UFC para usarmos
      },
      fontFamily: {
        // 3. Garante que a fonte 'Inter' seja a padrão
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
