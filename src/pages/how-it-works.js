import React from 'react';
import { Button, Col, Row } from 'antd'
import map from '../graphics/donation-map.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTruck, faUtensils, faShoppingBasket, faUserPlus} from '@fortawesome/free-solid-svg-icons'

const img = {
  height: 30,
  width: 'auto',
};

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
  padding: 10,
};

const whole = {
  backgroundColor: 'white',
};

const icon = {
  fontSize: '6em',
};

const block = {
  margin: '3em',
};

const center = {
  textAlign: 'center',
};

const video = {
  width: '90%',
  margin: 'auto',
};

const image = {
  width: '100%',
};

function howItWorks() {
  return (
    <div className="App" style={whole}>
      <Col span={16} offset={4}>
        <div className="Overview" style={block}>
          <h1 style={styles}>FEATURES OVERVIEW</h1>
          <p>Meal Matchup partners with local dining halls (donating agency), student groups (delivery agency),
              and non-profit organizations (receiving agency) to facilitate the transportation of food waste. 
              Using a responsive, open source website, dining halls indicate when they have extra food and when 
              student groups should pick it up. Volunteers pick up the excess food and transport it to a selected 
              shelter or other non-profit organization.</p>
          <Row>
            <Col span={4} offset={1} style={center}>
              <FontAwesomeIcon icon={faUserPlus} style={icon}/>
              <p>#1: Stakeholders <strong>sign up</strong> to participate</p>
            </Col>
            <Col span={4} offset={2} style={center}>
            <FontAwesomeIcon icon={faShoppingBasket} style={icon}/>
              <p>#2: Leftover <strong>food is collected</strong> in dining halls</p>
            </Col>
            <Col span={4} offset={2} style={center}>
              <FontAwesomeIcon icon={faTruck} style={icon}/>
              <p>#3: Volunteers <strong>deliver the food</strong> from dining halls to non-profits</p>
            </Col>
            <Col span={4} offset={2} style={center}>
            <FontAwesomeIcon icon={faUtensils} style={icon}/>
              <p>#4:<strong> People are fed</strong>, and food waste is avoided</p>
            </Col>
          </Row>
        </div>
        <hr></hr>
        <div className="explanation" style={block}>
          <h1 style={styles}>DETAILED FEATURES EXPLANATION</h1>
          <p>View the videos below for a one-minute overview of each agency system or click “view more” to see
             all video tutorials. There are also downloadable PDFs listed below in blue. If you have any further 
             questions about our approach or design thinking, please reach out to us through the contact page. </p>
          <Row>
            <Col span={7} offset={.5}>
              <h1>Donating Agency</h1>
              <p>Donating agencies, aka campus dinging halls, can utilize Meal Matchup to:</p>
              <ul>
                <li>Schedule recurring donation pickups with student service learners</li>
                <li>Request occasional emergency pick-ups</li>
                <li>Create and access up-to-date food logs that track pounds of food and type,</li>
                <li>Use a custom calendar to ensure increased consistency and transparency with pick-ups</li>
              </ul>
            </Col>
            <Col span={7} offset={1}>
              <h1>Delivery Agency</h1>
              <p>Delivery agencies, aka campus student groups, can utilize the mobile and 
                desktop versions of Meal Matchup to: </p>
              <ul>
                <li>Coordinate volunteer driver and delivery schedules</li>
                <li>Complete pickup and delivery of food donations, providing donating 
                  agencies with increased reliability and transparency</li>
              </ul>
            </Col>
            <Col span={7} offset={1}>
              <h1>Receiving Agency</h1>
              <p>Receiving agencies, aka local shelters, benefit from Meal Matchup's 
                transparent system that allows them to: </p>
              <ul>
                <li>Communicate and receive information about upcoming deliveries 
                  (time, deliverers, food logs, food descriptions etc.) </li>
                <li>Increased consistency and ease with which to receive donations </li>
              </ul>
            </Col>
          </Row>
        </div>
        <div className="Video" style={block}>
        <Row>
            <Col span={7}>
              <iframe style={video} src="https://www.youtube.com/embed/5WVkT89PoCM" frameborder="0" 
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              <h1><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9abad1905f44e420802d0/1537846191592/Overview_Donating_Agency_System.pdf">
                Overview: Donating Agency</a></h1>
              <ul>
                <li><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9ac927817f72d164921cb/1537846421675/Creating_Account_Donating_Group.pdf">
                  Creating an account</a></li>
                <li><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9acb1085229e608f35ba1/1537846450433/Donating_Settings.pdf">
                  Adjusting settings</a></li>
                <li><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9acdae79c70221c83f493/1537846490762/Recurring_Pickup.pdf">
                  Requesting recurring pick-up</a></li>
                <li><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9acc9652deac39f35845e/1537846474872/Dining_Halls_+Adding_Food_Items.pdf">
                  Adding food items</a></li>
              </ul>
              <div style={center}>
              <a href="https://www.youtube.com/watch?v=5WVkT89PoCM&list=PLdkr_H9JYyeA04J-StBiIAc4-dqLbCZeC">
                  <Button shape="round" type="primary">View More</Button></a>
              </div>
            </Col>
            <Col span={7} offset={1}>
              <iframe style={video} src="https://www.youtube.com/embed/bSYF6MOVCAo" frameborder="0" 
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              <h1><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9b22df4e1fc2155f2d4c9/1537847855481/Overview_+Delivery+Coordinator+System.pdf">
                Overview: Delivery Agency</a></h1>
              <ul>
                <li><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9b304e79c70221c842f94/1537848073425/Create+an+Account_+Delivery+Group.pdf">
                  Creating an account</a></li>
                <li><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9b3249140b71d9275a01a/1537848100679/Settings+Deliverer.pdf">
                  Adjusting settings</a></li>
                <li><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9b8ab1905f44e42087bc5/1537849516521/Student+Coordinators_+Assigning+Volunteers.pdf">
                  Coordinator: Assigning volunteers</a></li>
                <li><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9b34ce4966b9ef124ac93/1537848140608/Accepting+a+Pickup+.pdf">
                  Accepting a pick-up</a></li>
                <li><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9b33be4966b9ef124ac2c/1537848123828/Mobile+Walkthrough+for+Volunteer+Deliverers.pdf">
                  Mobile walk through</a></li>
              </ul>
              <div style={center}>
              <a href="https://www.youtube.com/watch?v=bSYF6MOVCAo&list=PLdkr_H9JYyeAdlcyfUS8J1mHuuZPSKYTf">
                  <Button shape="round" type="primary">View More</Button></a>
              </div>
            </Col>
            <Col span={7} offset={1}>
              <iframe style={video} src="https://www.youtube.com/embed/la8jmrMzUBA" frameborder="0" 
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              <h1><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9b669c83025b367816a65/1537848938860/Overview_+Receiving+Agency+System.pdf">
                Overview: Receiving Agency</a></h1>
              <ul>
                <li><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9b76315fcc0345e3de531/1537849190691/Creating+an+Account_+Receiving+Group.pdf">
                  Creating an account</a></li>
                <li><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9b781b208fc63480d9d5d/1537849218397/Settings+Receiving+.pdf">
                  Adjusting settings</a></li>
                <li><a href="https://static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ba9b9f624a694c2396f92c9/1537849848476/How+to+accept+a+recurring+delivery.pdf">
                  Accepting recurring deliveries</a></li>
              </ul>
              <div style={center}>
                <a href="https://www.youtube.com/watch?v=la8jmrMzUBA&index=4&list=PLdkr_H9JYyeBCb9xql8gIn3lw4HbvOdnz&t=1s">
                  <Button shape="round" type="primary">View More</Button></a>
              </div>
            </Col>
          </Row>
        </div>
        <hr></hr>
        <div className="stakeholders" style={block}>
          <h1 style={styles}>SIMPLIFIED STAKEHOLDER DIAGRAM FLOW</h1>
          <p>Pictured below is a simplified stakeholder flow diagram that depicts how agencies 
            use Meal Matchup to schedule, log, and deliver donations. Not pictured in the diagram 
            below are specific pages and/or features within Meal Matchup. Please see above videos 
            and PDF tutorials for a detailed account. </p>
          <img src={map} style={image} alt="Donation Road Map"/>
        </div>
      </Col>
    </div>
  );
}

export default howItWorks;
