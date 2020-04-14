import React from 'react';

import App, { AppPages } from '../components/App';
import SEO from '../components/SEO';

function IndexPage() {
	return (
		<App
			pageId={AppPages.Directory}
		>
			<SEO title="Meal Matchup" description="" />

			<p>Directory</p>
		</App>
	);
}

export default IndexPage;
