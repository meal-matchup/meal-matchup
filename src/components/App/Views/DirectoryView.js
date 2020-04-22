import React, { useEffect, useState } from 'react';
import firebase from 'gatsby-plugin-firebase';

import { AgencyTypes, RequestTypes } from '../Enums';

import DirectoryCard from './DirectoryCard';

function DirectoryView({umbrella, agency, agencies}) {

	const [list, setList] = useState(null);
	useEffect(() => {
		if (!firebase || !umbrella || !agency || list !== null) return;

		let mounted = true;

		const getAgencies = async () =>
			firebase
				.firestore()
				.collection('agencies')
				.where('umbrella', '==', umbrella.id)
				.get()
				.then((querySnapshot) => {
					const allAgencies = [];
					querySnapshot.forEach((agencyDoc) => {
						const theAgency = {
							id: agencyDoc.id,
							...agencyDoc.data(),
						};
						allAgencies.push(theAgency);
					});
					if (mounted) setList(allAgencies);
				});
		getAgencies();

		return () => {
			mounted = false;
		};
	}, [list, umbrella, agency]);




	return (
		<div>
			{list && list.map((agency) => {
                    return <DirectoryCard name = {agency.name}/>;
                  })}
		</div>
	);
}

export default DirectoryView;
