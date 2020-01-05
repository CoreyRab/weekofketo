// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

const tailwind = require("tailwindcss");
const purgecss = require("@fullhuman/postcss-purgecss");

const postcssPlugins = [tailwind("./tailwind.config.js")];

if (process.env.NODE_ENV === "production") postcssPlugins.push(purgecss());

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
	siteName: "Week of Keto",
	siteUrl: "https://youthful-sinoussi-3b94da.netlify.com",
	defaultImage: "/wok-meta.png",
	plugins: [
		// CONTENT
		{
			use: "gridsome-source-graphql-prismic",
			options: {
				url: process.env.PRISMIC_URL,
				fieldName: "prismicio",
				typeName: "prismicio",
				headers: {
					"Prismic-Ref": ``, // useMasterRef will overload this line
					Authorization: `Token ${process.env.PRISMIC_AUTH_TOKEN}`
				},
				useMasterRef: true // undefined by default
			}
		},
		{
			use: "gridsome-plugin-svg",
			options: {
				// default options below
				goesBothWays: false,
				svgo: [
					{
						removeTitle: false
					},
					{
						prefixIds: false
					},
					{
						addClassesToSVGElement: true
					},
					{
						removeDesc: false
					},
					{
						removeViewBox: false
					},
					{
						sortAttrs: true
					}
				]
			}
		},
		//TRACKING ANALYTICS
		{
			use: "@gridsome/plugin-google-analytics",
			options: {
				id: process.env.GA_ID
			}
		},
		{
			use: "gridsome-plugin-gtm",
			options: {
				id: process.env.GTM_ID,
				enabled: true
			}
		}
	],
	css: {
		loaderOptions: {
			postcss: {
				plugins: postcssPlugins
			}
		}
	}
};
