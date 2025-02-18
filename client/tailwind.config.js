/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./hooks/**/*.{js,jsx,ts,tsx}",
		"./redux/**/*.{js,jsx,ts,tsx}",
		"./utils/**/*.{js,jsx,ts,tsx}",
		"./constants/**/*.{js,jsx,ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				main: {
					DEFAULT: "#B25A1C",
					50: "#FFEDD5",
					light: "#BBA78D",
				},

				dark: {
					DEFAULT: "#151210",
					light: "#201D1C",
					border: "#272626",
				},

				light: {
					DEFAULT: "#F6F6F6",
					dark: "#E7E7E7",
					border: "#E0E0E0",
				},

				gray: {
					DEFAULT: "#3A3A3A",
					light: "#a4a4a4",
				},
			},
			fontFamily: {
				chunk: ["Chunk", "sans-serif"],
				chunkp: ["Chunk-Print", "sans-serif"],
				pthin: ["Poppins-Thin", "sans-serif"],
				pextralight: ["Poppins-ExtraLight", "sans-serif"],
				plight: ["Poppins-Light", "sans-serif"],
				pregular: ["Poppins-Regular", "sans-serif"],
				pmedium: ["Poppins-Medium", "sans-serif"],
				psemibold: ["Poppins-SemiBold", "sans-serif"],
				pbold: ["Poppins-Bold", "sans-serif"],
				pextrabold: ["Poppins-ExtraBold", "sans-serif"],
				pblack: ["Poppins-Black", "sans-serif"],
				makeba: ["Makeba", "sans-serif"],
			},
		},
	},
	plugins: [],
};
