import { Logo } from '../graphics/graphics';
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Font } from 'antd';
const { header } = Layout;
function Header() {
	const [mouse, setMouse] = useState(false);
	const hoverOn = () => {
		setMouse(true);
	};

	const hoverOff = () => {
		setMouse(false);
	};
	return (
		<Layout>
			<header
				className="header"
				style={{
					display: 'flex',
					flexDirection: 'row',
					padding: '20px 20px',
					backgroundColor: '#fff',
				}}
			>
				<img src={Logo} alt="logo" style={{ height: '10px' }} />
				<Menu
					theme="light"
					mode="horizontal"
					style={{
						marginLeft: 'auto',
						marginRight: '15px',
					}}
				>
					<Menu.Item
						key="1"
						style={{
							fontFamily: 'proxima-nova',
							fontWeight: '700',
							letterSpacing: '2.78px',
							fontSize: '12px',
						}}
					>
						CONTACT
					</Menu.Item>
					<Menu.Item
						key="2"
						style={{
							fontFamily: 'proxima-nova',
							fontWeight: '700',
							letterSpacing: '2.78px',
							fontSize: '12px',
						}}
					>
						HOME
					</Menu.Item>
					<Menu.Item
						key="3"
						style={{
							fontFamily: 'proxima-nova',
							fontWeight: '700',
							letterSpacing: '2.78px',
							fontSize: '12px',
						}}
					>
						ABOUT
					</Menu.Item>
					<Menu.Item
						key="4"
						style={{
							fontFamily: 'proxima-nova',
							fontWeight: '700',
							letterSpacing: '2.78px',
							fontSize: '12px',
						}}
					>
						HOW IT WORKS
					</Menu.Item>
					<Menu.Item
						key="5"
						style={{
							fontFamily: 'proxima-nova',
							fontWeight: '700',
							letterSpacing: '2.78px',
							fontSize: '12px',
							border: '2px solid',
							borderRadius: '300px',
						}}
						onMouseEnter={hoverOn}
						onMouseLeave={hoverOff}
						className={
							mouse ? 'backgroundColor: red' : 'backgroundColor: green'
						}
					>
						GET INVOLVED
					</Menu.Item>
				</Menu>
			</header>
		</Layout>
	);
}
export default Header;
