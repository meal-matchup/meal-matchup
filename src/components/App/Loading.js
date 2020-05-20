import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";

function Loading({ loading = false }) {
	return (
		<div className="loading" data-visible={loading}>
			<Spin size="large" />
		</div>
	);
}

Loading.propTypes = {
	loading: PropTypes.bool,
};

export default Loading;
