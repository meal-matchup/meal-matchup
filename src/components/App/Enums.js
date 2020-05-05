import React from 'react';
import { CalendarOutlined, ContactsOutlined, ProfileOutlined } from '@ant-design/icons';

export const AgencyTypes = {
	DONATOR: 'DONATOR',
	DELIVERER: 'DELIVERER',
	RECEIVER: 'RECEIVER',
	ANY: 'any',
};

export const RequestTypes = {
	PICKUP: 'PICKUP',
	BAGNTAG: 'BAGNTAG',
};

export const RequestTitles = {
	PICKUP: 'Pickup Request',
	BAGNTAG: 'Bag & Tag Request',
};

export const MenuLocations = {
	SIDER: 'SIDER',
	HEADER: 'HEADER',
};

export const AppPages = {
	CALENDAR: {
		location: MenuLocations.SIDER,
		id: 'CALENDAR',
		icon: <CalendarOutlined />,
		title: 'Calendar',
	},
	DIRECTORY: {
		location: MenuLocations.SIDER,
		id: 'DIRECTORY',
		icon: <ContactsOutlined />,
		title: 'Directory',
	},
	FOODLOGS: {
		location: MenuLocations.SIDER,
		id: 'FOODLOGS',
		icon: <ProfileOutlined />,
		title: 'Food Logs',
	},
	ACCOUNT: {
		location: MenuLocations.HEADER,
		id: 'ACCOUNT',
		title: 'Account',
	},
};

export const SiderPages = [AppPages.CALENDAR, AppPages.DIRECTORY, AppPages.FOODLOGS];

export const HeaderPages = [AppPages.ACCOUNT];
