import PropTypes, { InferProps } from "prop-types";
import React from "react";
import { Spin } from "antd";
import styled from "styled-components";

interface LoadingProps {
	loading: 1 | 0;
}

const LoadingWrapper = styled("div")<LoadingProps>`
	align-items: center;
	background-color: #fff;
	display: flex;
	height: 100%;
	justify-content: center;
	opacity: ${props => (props.loading ? "1" : "0")};
	position: fixed;
	transition: opacity 0.2s, visibility 0.2s;
	visibility: ${props => (props.loading ? "visible" : "hidden")};
	width: 100%;
	z-index: 9;
`;

class Loading extends React.Component<InferProps<typeof Loading.propTypes>> {
	static propTypes = {
		loading: PropTypes.bool,
	};

	render() {
		const loading = this.props.loading || false;

		return (
			<LoadingWrapper loading={loading ? 1 : 0}>
				<Spin size="large" />
			</LoadingWrapper>
		);
	}
}

export default Loading;
