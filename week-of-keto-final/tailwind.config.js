const { colors } = require("tailwindcss/defaultTheme");
module.exports = {
	theme: {
		extend: {
			colors: {
				avocado: "#F8F998",
				green: {
					...colors.green,
					"600": "#397546"
				}
			}
		},
		maxWidth: {
			"850px": "850px",
			"450px": "450px",
			"700px": "700px"
		}
	},
	variants: {},
	plugins: []
};
