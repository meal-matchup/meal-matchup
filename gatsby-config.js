require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`,
});

const {
	NODE_ENV,
	URL: NETLIFY_SITE_URL = 'https://www.mmuw.xyz',
	DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
	CONTEXT: NETLIFY_ENV = NODE_ENV,
} = process.env;

const isNetlifyProduction = NETLIFY_ENV === 'production';
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL;

module.exports = {
	siteMetadata: {
		title: 'Meal Matchup',
		description: '',
		siteUrl,
	},
	plugins: [
		'gatsby-plugin-sass',
		'gatsby-plugin-react-helmet',
		{
			resolve: 'gatsby-plugin-less',
			options: {
				javascriptEnabled: true,
			},
		},
		{
			resolve: 'gatsby-plugin-firebase',
			options: {
				credentials: {
					apiKey: process.env.GATSBY_FIREBASE_API_KEY,
					authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
					databaseURL: process.env.GATSBY_FIREBASE_DATABASE_URL,
					projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
					storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
					messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
					appId: process.env.GATSBY_FIREBASE_APP_ID,
				},
			},
		},
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				icon: 'src/graphics/icon.png',
			},
		},
	],
};
