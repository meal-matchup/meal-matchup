import {
	CalendarOutlined,
	ContactsOutlined,
	ProfileOutlined,
} from "@ant-design/icons";
import React from "react";
import firebase from "gatsby-plugin-firebase";

export interface AppContextInterface {
	agencies?: firebase.firestore.QuerySnapshot;
	agency?: firebase.firestore.QueryDocumentSnapshot;
	logs?: firebase.firestore.QuerySnapshot;
	requests?: firebase.firestore.QuerySnapshot;
	umbrella?: firebase.firestore.DocumentSnapshot;
	user?: firebase.User | null;
	userData?: firebase.firestore.DocumentData;
}

export type AppPage = {
	id: PageIDs;
	location: MenuLocations;
	icon?: React.ReactNode;
	title: string;
};

export enum PageIDs {
	CALENDAR,
	DIRECTORY,
	FOODLOGS,
	ACCOUNT,
}

export enum MenuLocations {
	SIDER,
	HEADER,
}

interface AppPagesInterface {
	[PageIDs: string]: AppPage;
}

export const AppPages: AppPagesInterface = {
	[PageIDs.CALENDAR]: {
		id: PageIDs.CALENDAR,
		location: MenuLocations.SIDER,
		icon: <CalendarOutlined />,
		title: "Calendar",
	},
	[PageIDs.DIRECTORY]: {
		id: PageIDs.DIRECTORY,
		location: MenuLocations.SIDER,
		icon: <ContactsOutlined />,
		title: "Directory",
	},
	[PageIDs.FOODLOGS]: {
		id: PageIDs.FOODLOGS,
		location: MenuLocations.SIDER,
		icon: <ProfileOutlined />,
		title: "Food Logs",
	},
	[PageIDs.ACCOUNT]: {
		id: PageIDs.ACCOUNT,
		location: MenuLocations.HEADER,
		title: "Account",
	},
};

export interface AppViewsInterface {
	[PageIDs: string]: React.ReactNode;
}

export type User = {
	id: string;
};

export type Umbrella = {
	id: string;
	name: string;
};

export type Address = {
	line1: string;
	line2?: string;
	city: string;
	state: string;
	zip: string;
};

export enum AgencyTypes {
	ANY = "ANY",
	DONATOR = "DONATOR",
	DELIVERER = "DELIVERER",
	RECEIVER = "RECEIVER",
	UMBRELLA = "UMBRELLA",
}

export interface AgencyTypeNameInterface {
	[AgencyType: string]: string;
}

export const AgencyTypeNames: AgencyTypeNameInterface = {
	[AgencyTypes.DONATOR]: "Donating Agency",
	[AgencyTypes.DELIVERER]: "Delivering Agency",
	[AgencyTypes.RECEIVER]: "Receiving Agency",
	[AgencyTypes.ANY]: "All Agencies",
};

export interface AgencyUser {
	name: string;
	email: string;
}

export type Agency = {
	id?: string;
	address: Address;
	approved: boolean;
	contact: {
		email: string;
		name: string;
		phone?: string;
	};
	admins?: {
		[id: string]: boolean;
	};
	members?: {
		[id: string]: boolean;
	};
	umbrella: string;
	users?: AgencyUser[];
	name: string;
	type: AgencyTypes;
};

export enum RequestTypes {
	PICKUP = "PICKUP",
	BAGNTAG = "BAGNTAG",
}

interface RequestTypeNamesInterface {
	[RequestTypes: string]: string;
}

export const RequestTypeNames: RequestTypeNamesInterface = {
	[RequestTypes.PICKUP]: "Pickup Request",
	[RequestTypes.BAGNTAG]: "Bag & Tag Request",
};

export type RequestOccurrence = {
	complete: boolean;
	date: firebase.firestore.Timestamp | Date;
	deliverers?: AgencyUser[];
};

export type Request = {
	id?: string;
	dates: {
		from: firebase.firestore.Timestamp | Date;
		to: firebase.firestore.Timestamp | Date;
	};
	deliverer: string;
	deliverers?: AgencyUser[];
	donator: string;
	frequency: string;
	notes?: string;
	// occurrences: RequestOccurrence[];
	receiver: string;
	time: {
		start: firebase.firestore.Timestamp | Date;
		to: firebase.firestore.Timestamp | Date;
	};
	type: RequestTypes;
	umbrella: string;
};

export type FoodLogItem = {
	name: string;
	weight: number;
};

export type FoodLogEntry = {
	requestId: string;
	items: FoodLogItem[];
	donatorSignature?: string;
	receiverSignature?: string;
};
