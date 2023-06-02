module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,vue}'],
  preserveHtmlElements: false,
  important: true,
  theme: {
    screens: {
      tablet: { max: '1024px' },
      sm: { max: '600px' },
    },
    colors: {
      primary: '#e73d1d',
      secondary: '#fec81a',
      text: '#444',
      white: '#fff',
      warning: '#ff3265',
      success: '#4184c7',
      background: '#f4f7fC',
      twitter: '#1d9bf0',
    },
  },
  plugins: [
    require('tailwindcss-children'),
    require('@tailwindcss/line-clamp'),
  ],
}
