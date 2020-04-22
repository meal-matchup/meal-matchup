import React, { useEffect, useState } from 'react';
import firebase from 'gatsby-plugin-firebase';

import { AgencyTypes, RequestTypes } from '../Enums';

import DirectoryCard from './DirectoryCard';

function DirectoryView({agencies}) {

	return (
		<div>
			{agencies && agencies.map((agency) => {
                    return <DirectoryCard name = {agency.name}/>;
                  })}
		</div>
	);
}

export default DirectoryView;
