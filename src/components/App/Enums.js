import React from 'react';
import { CalendarOutlined, ContactsOutlined } from '@ant-design/icons';

export const AgencyTypes = {
	DONATOR: 'DONATOR',
	DELIVERER: 'DELIVERER',
	RECEIVER: 'RECEIVER',
};

export const RequestTypes = {
	PICKUP: 'PICKUP',
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
	ACCOUNT: {
		location: MenuLocations.HEADER,
		id: 'ACCOUNT',
	},
};

export const SiderPages = [AppPages.CALENDAR, AppPages.DIRECTORY];

export const HeaderPages = [AppPages.ACCOUNT];
