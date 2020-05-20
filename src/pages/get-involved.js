import React from "react";
import { Button, Space } from "antd";
import { Row, Col } from "antd";

function NavBar() {
	return (
		<Row id="nav">
			<Col span={2} id="nav_img">
				<img
					src="//static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ced930d104c7b1fe213c959/1582793180802/?format=1500w"
					style={{ width: "70px", height: "45px" }}
				></img>
			</Col>
			<Col span={8} offset={13}>
				<Space direction="horizontal" size="large">
					<div className="collection">
						<a href="/Home">Home</a>
					</div>
					<div className="collection">
						<a href="/about">About</a>
					</div>
					<div className="collection">
						<a href="/how-it-works">How It Works</a>
					</div>
					<div className="collection">
						<a href="/get-involved">Get Involved</a>
					</div>
					<div className="collection">
						<a href="/contact">Contact</a>
					</div>
				</Space>
			</Col>
		</Row>
	);
}

function Header() {
	return (
		<header
			id="header"
			className="show-on-scroll"
			data-offset-el=".index-section"
			data-offset-behavior="bottom"
			role="banner"
		>
			<div id="header-inner">
				<div
					id="logoWrapper"
					className="wrapper"
					data-content-field="site-title"
				>
					<NavBar />
				</div>
			</div>
		</header>
	);
}

function Main() {
	return (
		<main id="page" role="main" style={{ display: "block" }}>
			<div id="item_container">
				<Row className="item-wrapper">
					<Col span={8} offset={4}>
						<div className="item">
							<div className="item-info">
								<h1>Food Recovery in Your Community</h1>
								<p>
									Start or expand food recovery efforts in your campus,
									community or city. Contact our Coordinator and see how Meal
									Matchup or similar practices can apply to your community.
								</p>
							</div>
							<div className="btn_wrapper">
								<Button type="primary" className="learn-more">
									Learn More
								</Button>
							</div>
						</div>
					</Col>
					<Col span={7} offset={1}>
						<div className="img_wrapper">
							<img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528070452083-D90RHP9TOH5SJ2G05N0T/ke17ZwdGBToddI8pDm48kNZr331BLc-Rota1ZP1Yh3h7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0hReLB75oIvKxcDxwlnLXaYNPa96OWO5Z21xzWqpQF_bv3E39NLc0xdQYNJZ7z0n0g/salad+bar.JPG"></img>
						</div>
					</Col>
				</Row>
				<hr></hr>
				<Row className="item-wrapper">
					<Col span={8} offset={4}>
						<div className="item">
							<div className="item-info">
								<h1>Join Meal Matchup at the University of Washington</h1>
								<p>
									Join Meal Matchup at the University of Washington Seattle
									campus as a dining hall, volunteer, or non-profit
									organization. Contact our Coordinator to learn more about how
									Meal Matchup works and if Meal Matchup would be a good fit for
									you or your organization.
								</p>
							</div>
							<div className="btn_wrapper">
								<Button type="primary" className="learn-more">
									Learn More
								</Button>
							</div>
						</div>
					</Col>
					<Col span={7} offset={1}>
						<div className="img_wrapper">
							<img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1526458179015-8A4YGBAK2ZJAK7SAO85X/ke17ZwdGBToddI8pDm48kK60W-ob1oA2Fm-j4E_9NQB7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0kD6Ec8Uq9YczfrzwR7e2Mh5VMMOxnTbph8FXiclivDQnof69TlCeE0rAhj6HUpXkw/ashley-whitlatch-569234-unsplash.jpg"></img>
						</div>
					</Col>
				</Row>
			</div>
		</main>
	);
}

function Footer() {
	return (
		<div className="footer">
			<Row>
				<Col span={8} offset={8}>
					<Space direction="horizontal" size="large">
						<div className="collection">
							<a href="/contact">Contact</a>
						</div>
						<div className="collection homepage">
							<a href="/Home">Home</a>
						</div>
						<div className="collection">
							<a href="/about">About</a>
						</div>
						<div className="collection">
							<a href="/how-it-works">How It Works</a>
						</div>
						<div className="collection">
							<a href="/get-involved">Get Involved</a>
						</div>
					</Space>
				</Col>
			</Row>
			<Row>
				<Col span={8} offset={8}>
					<p class="footer-info">
						University of Washington in Seattle, Washington, USA
					</p>
				</Col>
			</Row>
			<Row>
				<Col span={14} offset={5}>
					<p class="footer-info">
						Copyright 2020. Site content is licensed under a Creative Commons
						Attribution 4.0 International License.
					</p>
				</Col>
			</Row>
		</div>
	);
}

function Get_Involved() {
	return (
		<div className="container">
			<Header />
			<Main />
			<Footer />
		</div>
	);
}

export default Get_Involved;
