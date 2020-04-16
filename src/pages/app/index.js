import React, { useState } from 'react';
import { Calendar, Drawer, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import App, { AppPages } from '../../components/App';
import SEO from '../../components/SEO';

function IndexPage() {
	const [pickupRequestOpen, setPickupRequestOpen] = useState(false);

	return (
		<App pageId={AppPages.Calendar}>
			<SEO title="Meal Matchup" description="" />

			<div className="events-calendar">
				<Calendar />

				<div className="calendar-buttons-container">
					<Button type="primary" onClick={() => setPickupRequestOpen(true)}>
						<PlusOutlined /> New Pickup Request
					</Button>
				</div>

				<Drawer
					className="drawer"
					title="New Pickup Request"
					visible={pickupRequestOpen}
					onClose={() => setPickupRequestOpen(false)}
				>
					<p>Put pickup request form here</p>
				</Drawer>
			</div>
		</App>
	);
}

export default IndexPage;
