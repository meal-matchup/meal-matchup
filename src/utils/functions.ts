import { Address, AgencyTypes } from "./enums";

/**
 * Gives a TypeScript typed AgencyType
 *
 * @param type A string used to get an agency type
 * @returns A typed AgencyType
 */
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

/**
 * Compares dates and returns true if they are the same date irrelevant of time.
 * @param a One date
 * @param b Another date
 */
export const isSameDate = (a: Date, b: Date): boolean => {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
};

/**
 * Checks if a date falls within a period between a and b
 *
 * @param a A period start date
 * @param b A period end date
 * @param date A date to check if it's in the period
 */
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

/**
 * Creates a Google Maps URL from an address
 * @param address An address
 */
export const formGoogleMapsUrl = (address: Address): string => {
	let str = address.line1;
	if (address.line2) str += ` ${address.line2}`;
	str += `, ${address.city}, ${address.state} ${address.zip}`;

	return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
		str
	)}`;
};
