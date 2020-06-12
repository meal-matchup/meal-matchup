import PropTypes, { InferProps } from "prop-types";
import React from "react";
import { motion } from "framer-motion";

class AppPage extends React.Component<InferProps<typeof AppPage.propTypes>> {
	static propTypes = {
		id: PropTypes.string.isRequired,
		children: PropTypes.node,
	};

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
