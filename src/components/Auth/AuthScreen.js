import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

function AuthScreen({ id, children }) {
	return (
		<motion.div
			key={id}
			className="auth-screen"
			initial={{
				opacity: 0,
				x: 50,
			}}
			animate={{
				opacity: 1,
				x: 0,
			}}
			exit={{
				opacity: 0,
				x: -50,
			}}
		>
			{children}
		</motion.div>
	);
}

AuthScreen.propTypes = {
	id: PropTypes.string.isRequired,
};

export default AuthScreen;
