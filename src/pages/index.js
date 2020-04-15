import React from 'react';
import { Calendar } from 'antd';

import App, { AppPages } from '../components/App';
import SEO from '../components/SEO';

function IndexPage() {
	return (
		<App pageId={AppPages.Calendar}>
			<SEO title="Meal Matchup" description="" />

			<Calendar />
		</App>
	);
}

export default IndexPage;
