import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-yellow':'#FED700',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-out',
        'fadeOut': 'fadeOut 0.5s ease-out',
        'blob': 'blob 7s infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'light-beam': 'light-beam 8s linear infinite',
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        fadeIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(5px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)'
          },
        },
        fadeOut: {
          '0%': { 
            opacity: '1', 
            transform: 'translateY(0)'
          },
          '100%': { 
            opacity: '0', 
            transform: 'translateY(-5px)'
          },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        twinkle: {
          '0%': { 
            opacity: '0.1',
            transform: 'scale(0.6)',
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1)',
          },
          '100%': { 
            opacity: '0.1',
            transform: 'scale(0.6)',
          },
        },
        'light-beam': {
          '0%': {
            transform: 'translateX(-100%) translateY(-100%) rotate(-45deg)',
          },
          '100%': {
            transform: 'translateX(200%) translateY(200%) rotate(-45deg)',
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.8",
          },
        },
      },
      transitionDelay: {
        '0': '0ms',
        '700': '700ms',
        '1500': '1500ms',
        '2000': '2000ms',
        "4000": "4000ms",
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
      },
    },
  },  
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("daisyui"),
    function ({ addUtilities }: any) {
      const newUtilities = {
        ".animation-delay-2000": {
          "animation-delay": "2s",
        },
        ".animation-delay-4000": {
          "animation-delay": "4s",
        },
      };
      addUtilities(newUtilities);
    },
  ],
  daisyui: {
    themes: ["light"],
  },
};
export default config;
