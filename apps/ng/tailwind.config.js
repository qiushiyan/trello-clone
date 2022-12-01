/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,ts}"],
	theme: {
		extend: {
			fontFamily: {
				"sans-serif": ["Raleway", "sans-serif"],
			},
		},
	},
	plugins: [require("daisyui")],

	daisyui: {
		themes: ["cupcake"],
	},
};
