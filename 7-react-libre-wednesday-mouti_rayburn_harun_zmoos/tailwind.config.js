/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6D28D9', // Violet-700
        primaryHover: '#7C3AED', // Violet-600
        background: '#1F2937', // Gray-800 pour un fond sombre
        textPrimary: '#FFFFFF', // Blanc
        error: '#EF4444', // Red-500
        success: '#10B981', // Green-500 pour succès
        draw: '#F59842', // Orange-500 pour égalité
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      }
    }
  },
  plugins: [
    function({ addComponents }) {
      const components = {
        '.loading': {
          '@apply relative h-32 w-32 border-8 border-t-8 border-primary border-t-transparent rounded-full animate-spin-slow': {},
        },
        '.loading-container': {
          '@apply relative flex items-center justify-center': {},
        },
        '.loading img': {
          '@apply absolute h-16 w-16': {},
        },
      }
      addComponents(components)
    }
  ]
}
