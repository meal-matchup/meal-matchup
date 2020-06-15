import { Drawer } from "antd";
import styled from "styled-components";

/** Creates a styled ant.design drawer */
const DrawerWrapper = styled(Drawer)`
	&.ant-drawer-open {
		& > .ant-drawer-content-wrapper {
			width: 100% !important;

			@media (min-width: ${props => props.theme.breakpoints.md}) {
				width: 640px !important;
			}
		}
	}
`;

export default DrawerWrapper;
