import React from 'react';

import { Logo } from '../graphics/graphics';

function IndexPage() {
	return (
		<div
			style={{
				backgroundColor: '#fff',
				borderRadius: '2em',
				boxShadow: '0 0 1em rgba(0, 0, 0, .25)',
				color: '#222',
				left: '50%',
				maxWidth: '576px',
				padding: '4em 2em',
				position: 'absolute',
				textAlign: 'center',
				top: '50%',
				transform: 'translate3d(-50%, -50%, 0)',
				width: '100%',
			}}
		>
			<Logo />
			<p style={{ marginBottom: '0' }}>Coming soon!</p>
		</div>
	);
}

export default IndexPage;
