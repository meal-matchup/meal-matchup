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
const firebasePrefix = isNetlifyProduction ? 'PROD' : 'DEV';

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
					apiKey: process.env[`${firebasePrefix}_FIREBASE_API_KEY`],
					authDomain: process.env[`${firebasePrefix}_FIREBASE_AUTH_DOMAIN`],
					databaseURL: process.env[`${firebasePrefix}_FIREBASE_DATABASE_URL`],
					projectId: process.env[`${firebasePrefix}_FIREBASE_PROJECT_ID`],
					storageBucket:
						process.env[`${firebasePrefix}_FIREBASE_STORAGE_BUCKET`],
					messagingSenderId:
						process.env[`${firebasePrefix}_FIREBASE_MESSAGING_SENDER_ID`],
					appId: process.env[`${firebasePrefix}_FIREBASE_APP_ID`],
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
