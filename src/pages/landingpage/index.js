import React, { Component } from 'react';
import { Link } from 'gatsby';
import Figure from 'react-bootstrap/Figure';
import { Button, Col, Row } from 'antd'
import './LandingPage.scss';

const WelcomeBannerStyle = {
	// data-image-dimensions="2247x1168"
	// 			data-image-focal-point="0.48,0.48"
	// 			data-parent-ratio="1.2"
	// 			alt="Meal Matchup Banner Image 2.png"
	// 			style="font-size: 0px; left: -159.974px; top: 0px; width: 917.653px; height: 477px; position: relative;"
	// 			class=""
	// 			data-image-resolution="2500w"
	color: 'white',
	top: '50%',
	left: '50%',
	textAlign: 'center',
	float: 'center'
}

const PageStyle = {
	backgroundColor: 'white'
}

class IndexPage extends Component {
	render() {
		return (
			<div className="Page" style={PageStyle}>
				<div className="WelcomeBanner">
				<p className="a"> <strong>hello there boo </strong> </p>
				<h1> <strong> hi there </strong>hi there </h1>
				<Figure>
					<Figure.Image
					style={{ width: '100%', height: '100%', position: 'relative' }}
					alt="Meal Matchup Banner Img 2"
					img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1529082313428-CZ7X3GGNA408E60DCCLA/ke17ZwdGBToddI8pDm48kEgrZIvdIxS5OU_FxnzWipF7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UWuxNxUXXtBY_EIvOzrTi5OeFIXa2I0qbJKZRQL0nwe-JvwGh1qtNWvMhYKnvaKhbA/Meal+Matchup+Banner+Image+2.png?format=2500w"
					className="figure-img img-fluid z-depth-1"
					/>
					<Figure.Caption style={WelcomeBannerStyle}>
						yes blah
					</Figure.Caption>
						<div className="welcome-desc">
							<p className="">
								<br/>Welcome to Meal Matchup where we feed the hungry and streamline efficiency of food recovery.
								<br/><a href="https://uw-foodwaste.firebaseapp.com/" target="_blank"><strong>Sign Up</strong></a>
							</p>
						</div>
					</Figure>
				</div>

				<div className="MainBody">
					<div className="matter-container">
						<h2>Why We Matter</h2>
						<Row>
							<Col span={10} offset={2}>

							<h3>Meal Matchup facilitates the donation of left over food from University of Washington dining halls to local non-profits:</h3>
							<li>Feeding people in need</li>
							<li>Reducing greenhouse gas emissions (GHG) generated from food compost</li>
							<li>Using an interactive, responsive, website</li>
							<li>Tracking pounds of food diverted from compost</li>
							<li>Delivering food via service learning students </li>
							<li>Increasing student service learning opportunities and related civic engagement</li>
							</Col>
							<Col span={8}>
								<img
									height={358.78}
									width={461.25}
									alt="Screengrab of Meal Matchup"
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1529080212490-AB75IS5PZBBBQ1Y1JP7Q/ke17ZwdGBToddI8pDm48kGWsnMOvruRLTZUYpYyAYJN7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UfEbNPym5E0iduOmixXMMVtboyMg9IhKtGBTVRspbM_pP7cJNZlDXbgJNE9ef52e8w/DRG+Photo.png?format=1000w"
								/>
							</Col>
						</Row>
					</div>

					<hr/>

					<div className="differ-container">
						<h2>How We Differ</h2>
						<h3 className="centerText">
							Meal Matchup differs from most existing food recovery platforms in
							three key ways:
						</h3>
						<Row>
							<Col span={5} offset={2}>
								<img
									className="centerIcon"
									alt="two purple people icon"
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1538296768145-WCPRGCXC73HH52SQPGE3/ke17ZwdGBToddI8pDm48kBhs0kXmJu3pAC_LFF99rKVZw-zPPgdn4jUwVcJE1ZvWhcwhEtWJXoshNdA9f1qD7eaDBaxyzPPG4B3J3_Z93rYLky5fjRrZeLmMK3F2aytfjfg4x4lXesDnM4MUpb-Vdw/group+round.png?format=300w"
								/>
								<h4>
									We employed a human centered design process in our work.{' '}
								</h4>
							</Col>
							<Col span={5} offset={2}>
								<img className="centerIcon"
										alt="orange world icon"
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1538294874066-WU91V3HYAP2HMFII0HS5/ke17ZwdGBToddI8pDm48kBhs0kXmJu3pAC_LFF99rKVZw-zPPgdn4jUwVcJE1ZvWhcwhEtWJXoshNdA9f1qD7eaDBaxyzPPG4B3J3_Z93rYLky5fjRrZeLmMK3F2aytfjfg4x4lXesDnM4MUpb-Vdw/globe.png?format=300w"
								/>
								<h4>
									We built our software open source for global scalability.
								</h4>
							</Col>
							<Col span={5} offset={2}>
								<img className="centerIcon"
										alt="teal car icon"
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1538294905748-Y1ZVBBPRFSQLJPC01RDW/ke17ZwdGBToddI8pDm48kBhs0kXmJu3pAC_LFF99rKVZw-zPPgdn4jUwVcJE1ZvWhcwhEtWJXoshNdA9f1qD7eaDBaxyzPPG4B3J3_Z93rYLky5fjRrZeLmMK3F2aytfjfg4x4lXesDnM4MUpb-Vdw/round+car.png?format=300w"
								/>
								<h4>
									We provide the delivery of food via service learning students.
								</h4>
							</Col>
						</Row>
					</div>

					<hr/>

					<div className="research-container">
						<h2>Our Research</h2>
						<Row>
							<Col span={10} offset={3}>
								<iframe width="461" height="259" src="https://www.youtube.com/embed/06bxkNJRPxY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
							</Col>
							<Col span={7}>
								<h3>We reviewed more than <strong>15 apps and interviewed 50 agencies</strong> in Seattle and found: </h3>
								<li>Many institutions, including the UW, have needs that are not fully addressed by existing food recovery programs.</li>
								<li>Transportation of food (less than 50 pounds) is one of the largest pain points in food recovery work, leading us to tap into service learning students for deliveries.</li>
							</Col>
						</Row>
					</div>

					<hr/>

					<div className="problem-container">
						<h2>The Problem</h2>
						<Row>
							<Col span={4} offset={4}>
								<img
									className="centerIcon"
									alt="trash can icon"
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1526455509263-8AXKXQ75W1APYHK12WRJ/ke17ZwdGBToddI8pDm48kMpoD4m_jLD4h0yxKk0BgcJZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpx0OkoJ6dyuJJ3ALew_Vn3HKAGVso7zt1BFiHMB78RsHHPGNJL-xjF8yKx_YovOJgk/Group+2+%2810%29.png?format=500w"
								/>
								<h4>In the U.S. alone, 40% of food is wasted</h4>
							</Col>
							<Col span={4}>
								<img className="centerIcon"
									alt="three ppl icon"
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1526455431008-69EYXI3NMMHBAF5QMPUS/ke17ZwdGBToddI8pDm48kMpoD4m_jLD4h0yxKk0BgcJZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpx0OkoJ6dyuJJ3ALew_Vn3HKAGVso7zt1BFiHMB78RsHHPGNJL-xjF8yKx_YovOJgk/Group+2+%2812%29.png?format=500w"
								/>
								<h4>About 15.6 million people were food insecure last year</h4>
							</Col>
							<Col span={4} offset={1}>
								<img
									className="centerIcon"
									alt="smoke stack icon"
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1526455311837-M30FZW4YRL6SNRB504IX/ke17ZwdGBToddI8pDm48kMpoD4m_jLD4h0yxKk0BgcJZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpx0OkoJ6dyuJJ3ALew_Vn3HKAGVso7zt1BFiHMB78RsHHPGNJL-xjF8yKx_YovOJgk/Group+2+%2811%29.png?format=500w"
								/>
								<h4>Food waste causes 14% of greenhouse gas emissions</h4>
							</Col>
							<Col span={4}>
								<img
									className="centerIcon"
									alt="money bag icon"
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1526455365133-PT8H9GA2S9DG1W1O4G1A/ke17ZwdGBToddI8pDm48kMpoD4m_jLD4h0yxKk0BgcJZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpx0OkoJ6dyuJJ3ALew_Vn3HKAGVso7zt1BFiHMB78RsHHPGNJL-xjF8yKx_YovOJgk/Group+3+%281%29.png?format=500w"
								/>
								<h4>
									$161 billion worth of food is wasted annually in the U.S.
								</h4>
							</Col>
						</Row>
					</div>

					<hr />

					<div className="solution-container">
						<h2>The Solution</h2>
						<Row>
							<Col span={8} offset={4}>
								<img
									data-src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528069150374-2CXTWMUNDUFNAR55L6ZL/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/IMG_4781.jpg"
									data-image="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528069150374-2CXTWMUNDUFNAR55L6ZL/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/IMG_4781.jpg"
									data-image-dimensions="2500x1667"
									data-image-focal-point="0.5,0.5"
									data-parent-ratio="1.5"
									alt="IMG_4781.jpg"
									data-image-resolution="1500w"
									height={360}
									width={478}
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528069150374-2CXTWMUNDUFNAR55L6ZL/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/IMG_4781.jpg?format=1500w"
								/>
							</Col>
							<Col span={8}>
								<div className="solutionGreenBox">
									<h3>Meal Matchup</h3>

									<p className="min-font">
										Meal Matchup not only reduces food waste, protects the
										environment, fights against hunger, and streamlines
										efficiency of food recovery, but also offers a simple
										donating leftover food and provides students with
										community involvement opportunities.
									</p>
								</div>
							</Col>
						</Row>
					</div>

					<hr />

					<div className="how-it-works-container">
						<h2>How It Works</h2>
						<h3>
							Meal Matchup partners with local dining halls, student groups, and
							non-profit organizations to facilitate the transportation of food
							waste. Using an open source website, dining halls indicate when
							they have extra food and when student groups should pick it up.
							Volunteers pick up the excess food and transport it to a selected
							shelter or other non-profit organization.
						</h3>
						<Row>
							<Col span={4} offset={2}>
								<img
									className="centerIcon"
									alt="person + icon"
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528239823312-BAC2Y1VD51K3D94QX48X/ke17ZwdGBToddI8pDm48kMpoD4m_jLD4h0yxKk0BgcJZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpx0OkoJ6dyuJJ3ALew_Vn3HKAGVso7zt1BFiHMB78RsHHPGNJL-xjF8yKx_YovOJgk/Group+3+%282%29.png?format=500w"
								/>
								<h4>#1: Stakeholders sign up to participate</h4>
							</Col>
							<Col span={4} offset={1}>
								<img
									className="centerIcon"
									alt="box of food icon"
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528239803478-CTKGPN19MZRVPT8ONC61/ke17ZwdGBToddI8pDm48kMpoD4m_jLD4h0yxKk0BgcJZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpx0OkoJ6dyuJJ3ALew_Vn3HKAGVso7zt1BFiHMB78RsHHPGNJL-xjF8yKx_YovOJgk/Group+2+%288%29.png?format=500w"
								/>
								<h4>#2: Leftover food is collected in dining halls</h4>
							</Col>
							<Col span={4} offset={1}>
							<img
									className="centerIcon"
									alt="food truck icon"
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528239832480-1A4IFOUW82LE0JBA53CS/ke17ZwdGBToddI8pDm48kMpoD4m_jLD4h0yxKk0BgcJZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpx0OkoJ6dyuJJ3ALew_Vn3HKAGVso7zt1BFiHMB78RsHHPGNJL-xjF8yKx_YovOJgk/Group+2+%289%29.png?format=500w"
								/>
								<h4>#3: Volunteers deliver the food from dining halls to non-profits</h4>
							</Col>
							<Col span={4} offset={1}>
							<img
									className="centerIcon"
									alt="plate icon"
									src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528240804263-MJ6VOLW99A45UXHJPNMR/ke17ZwdGBToddI8pDm48kKakeCQMRh3FUlazohtKDV1Zw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpyIPoLSPAce4kL8Zk7Ylzul_X-d77ki1GvpOAOWFy5r-31NoHXPuOgSKvGakIuaWNs/Group+2+%2813%29.png?format=500w"
								/>
								<h4>#4: People are fed, and food waste is avoided</h4>
							</Col>
						</Row>
					</div>
				</div>
			</div>
		);
	}
}

export default IndexPage;
