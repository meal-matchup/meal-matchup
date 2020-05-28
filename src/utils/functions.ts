import { Address, AgencyTypes } from "./enums";

export const getAgencyType = (type: string): AgencyTypes => {
	switch (type) {
		case AgencyTypes.DONATOR:
			return AgencyTypes.DONATOR;

		case AgencyTypes.RECEIVER:
			return AgencyTypes.RECEIVER;

		default:
			return AgencyTypes.DELIVERER;
	}
};

export const isSameDate = (a: Date, b: Date): boolean => {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
};

export const isSameWeekdayInPeriod = (
	a: Date,
	b: Date,
	date: Date
): boolean => {
	a.setHours(0, 0, 0, 0);
	b.setHours(0, 0, 0, 0);
	date.setHours(0, 0, 0, 0);

	return date.getDay() === a.getDay() && date >= a && date <= b;
};

export const formGoogleMapsUrl = (address: Address): string => {
	let str = address.line1;
	if (address.line2) str += ` ${address.line2}`;
	str += `, ${address.city}, ${address.state} ${address.zip}`;

	return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
		str
	)}`;
};
