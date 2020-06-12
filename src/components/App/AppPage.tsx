import React from "react";
import { motion } from "framer-motion";

interface AppPageProps {
	id: string;
	children?: React.ReactNode;
}

class AppPage extends React.Component<AppPageProps> {
	/** Renders the app page given an ID */
	render() {
		const { id, children } = this.props;

		return (
			<motion.div
				key={id}
				variants={{
					visible: {
						opacity: 1,
					},
					hidden: {
						opacity: 0,
					},
				}}
				initial="hidden"
				animate="visible"
				exit="hidden"
			>
				{children && children}
			</motion.div>
		);
	}
}

export default AppPage;
