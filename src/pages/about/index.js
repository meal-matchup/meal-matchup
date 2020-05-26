import React from 'react';
import { Row, Col } from 'antd';
import { Carousel } from 'antd';
import { Divider } from 'antd';
import './App.css';


function Mission() {
  return(
    <div id="mission-statement">
      <Row justify="center">
        <Col xs={12} m={6} lg={4} span={4}>
            <h1>OUR MISSION</h1>
        </Col>

        <Col xs={12} m={6} lg={12} span={12}>
          <Row>
            <p> Our goal is to strengthen sustainable food practices through our interactive, responsive, open source website
                at the University of Washington (UW) by connecting dining hall and shelter managers with service learning student
                food deliverers and in doing so:
            </p>
          </Row>

          <Row>
            <ul>
                <li>Feed people in need</li>
                <li>Help protect the environment</li>
                <li>Increase student service learning opportunities and related civic engagement</li>
                <li>Reduce the exorbitant amount of money lost on food waste</li>
                <li>Create a model that could be implemented at other universities and communities around the world</li>
            </ul>
          </Row>

          <Row>
            <p>
                We designed documentation and tutorials (see "How It Works" page) that can provide a blueprint for universities
                and large organizations to set up similar sites to tackle food waste. Further, through our work, we are educating
                the public on the food waste epidemic and creating food recovery ambassadors who will carry on the mission of feeding
                people in need, reducing CO2 emissions by diverting food waste from landfills and compost, and reducing the billions
                of dollars lost on food waste each year, all while building a network that prompts communal action. 
            </p>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

function SpringQPicture() {
  return(
    <div id="spring-q-photo">
      <Row>
        <Col span={24}>&nbsp;</Col>
      </Row>
      <Row>
          <Col span={12} offset={6}>
            <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1537856863830-B747ANADQHK0TK1E56G6/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/Spring+DRG+2+.JPG?format=2500w" style={{width: "100%", height: "auto", maxHeight: "25em", objectFit: "cover"}}></img>
          </Col>
      </Row>
      <Row>
        <Col span={12} offset={6}>
          <p>Spring quarter with undergraduate and graduate students from Human Centered Design
              &amp; Engineering, the Information School, and the Paul G. Allen School of Computer Science
              and Engineering
          </p>
        </Col>
      </Row>
      <Row>
        <Col span={24}>&nbsp;</Col>
      </Row>
    </div>
  );
}

function How_It_Began() {
  return(
    <div id="how-it-began">
      <Row>
        <Col span={24}>&nbsp;</Col>
      </Row>
      <Row justify="center">
          <Col xs={12} m={6} lg={4} span={4}>
            <h1>HOW IT BEGAN</h1>
          </Col>

          <Col xs={12} m={6} lg={12} span={12}>
            <Row>
                <p> The UW comprises more than 46,000 students and 26,000 staff and faculty; many of them are served by a number of large
                    campus dining halls. The idea for Meal Matchup arose from undergraduate student Madison Holbrook’s pitch for a food
                    recovery website in Irini Spyridakis’ Advanced Sustainable Communication class in the Department of
                    <a href="https://www.hcde.washington.edu/"> Human-Centered Design and Engineering</a> (HCDE) at the UW. </p>
            </Row>

            <Row>
                <p> Spyridakis and Holbrook, who both share a background and interest in food security and resource constrained
                    environments, co-wrote a proposal where they successfully acquired funding from the UW 
                    <a href="https://csf.uw.edu/"> Campus Sustainability Fund</a> that funds sustainability projects at the UW. </p>
            </Row>

            <Row>
                <p> After receiving funding, they gathered 33 students from HCDE, the Paul G. Allen School of Computer Science and
                    Engineering, and the Information School over 9 months to work as part of a 
                    <a href="https://www.hcde.washington.edu/research/archives/spyridakis"> Directed Research Group</a>, beginning in
                    Autumn 2017. They conducted further research on the topic, designed and built the website, and assisted with the Meal
                    Matchup pilot in May 2018 along with support and food delivery work from service learning students in the College of
                    the Environment. </p>
            </Row>

            <Row>
                <strong>Winter 2020 Update</strong>
                <p> Irini Spyridakis, HCDE faculty, continues to help grow and direct the project as Madison Holbrook graduated in June
                    2018. By Winter 2020, another 70 students contributed to the project through DRGs in HCDE, independent studies, and
                    through service learning classes in ENVR 498, ENVR 480, and numerous other service learning classes, 
                    resulting in more than 1,300 pounds of food delivered to 4 local shelters. Please see below for
                    UW liaisons, our academic and industry advisory board, acknowledgments, press, and awards. </p>
            </Row>
          </Col>
      </Row>
    </div>
  );
}

function onChange(a, b, c) {
  console.log(a, b, c);
}

function Photo_Gallery() {
  return(
    <div id="photo-gallery">
      <Row justify="center">
        <Col span={16}>
          <Divider/>
        </Col>
      </Row>

      <Row justify="center">
        <Col span={4}>
          <h1>PHOTO GALLERY</h1>
        </Col>
        <Col span={12}>
        </Col>
      </Row>
      
      <Row>
        <Col span={12} offset={6}>
          <Carousel afterChange={onChange}>
            <div>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1536328560228-5HTDMG0IERFYLI9BAG8N/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/MealMatchupDeliverers.jpg?format=2500w" style={{width: "100%", maxWidth: "60em", height: "auto", maxHeight: "30em", objectFit: "cover"}}></img>
            </div>
            <div>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528069962290-WKCY7OLKVFFSULZRM7F8/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/IMG_4781.jpg?format=2500w" style={{width: "100%", maxWidth: "60em", height: "auto", maxHeight: "30em", objectFit: "cover"}}></img>
            </div>
            <div>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528069956034-L7GQJA8GN9KKNLQ05EMZ/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/IMG_4787.jpg?format=2500w" style={{width: "100%", maxWidth: "60em", height: "auto", maxHeight: "30em", objectFit: "cover"}}></img>
            </div>
            <div>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528069897158-6NUULH0PL285EYXBSHSR/ke17ZwdGBToddI8pDm48kK60W-ob1oA2Fm-j4E_9NQB7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0kD6Ec8Uq9YczfrzwR7e2Mh5VMMOxnTbph8FXiclivDQnof69TlCeE0rAhj6HUpXkw/IMG_0731.JPG?format=2500w" style={{width: "100%", maxWidth: "60em", height: "auto", maxHeight: "30em", objectFit: "cover"}}></img>
            </div>
            <div>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528069889376-9GVMQFZZD8LLFO6O9GC3/ke17ZwdGBToddI8pDm48kCPztTQZpDiZMOuuCfUxiyx7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UYlQ-m0oNUh_9buvyC-f1CSdhG_dNlqULB2ZTz-ses64A-QPhXXvNcU0N8wN7BGx0g/IMG_0849.JPG?format=2500w" style={{width: "100%", maxWidth: "60em", height: "auto", maxHeight: "30em", objectFit: "cover"}}></img>
            </div>
            <div>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528070115238-2H2TRQLQ74RYA6JG2TLQ/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/IMG_3438+%281%29.JPG?format=2500w" style={{width: "100%", maxWidth: "60em", height: "auto", maxHeight: "30em", objectFit: "cover"}}></img>
            </div>
            <div>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1526603526887-HGW4WB47OJ2NEXWCQ7VD/ke17ZwdGBToddI8pDm48kDHPSfPanjkWqhH6pl6g5ph7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0mwONMR1ELp49Lyc52iWr5dNb1QJw9casjKdtTg1_-y4jz4ptJBmI9gQmbjSQnNGng/767EA5BD-9D8C-428A-A1B2-B801E8AF9D63.jpg?format=2500w" style={{width: "100%", maxWidth: "60em", height: "auto", maxHeight: "30em", objectFit: "cover"}}></img>
            </div>
            <div>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528070116938-SMOP3NAALK0ATG4GYML5/ke17ZwdGBToddI8pDm48kO3p2ZItWxp8C4Cy5ixDUBJ7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UfJq45Bbz3uWKcfIeNJ_PgH7d_9v34I-ondB24PMqZwEBsc6d8xABtQMYHwnG515BA/5a7d015889700.image.jpg?format=2500w" style={{width: "100%", maxWidth: "60em", height: "auto", maxHeight: "30em", objectFit: "cover"}}></img>
            </div>
          </Carousel>
        </Col>
      </Row>
      <Row>
        <Col span={24}>&nbsp;</Col>
      </Row>
    </div>
  );
}

function Meal_Matchup_Team() {
  return(
    <div id="how-it-began">
      <Row justify="center">
        <Col span={16}>
          <Divider/>
        </Col>
      </Row>

      <Row >
        <Col offset={4}>
          <h1>MEAL MATCHUP TEAM MEMBERS</h1>
        </Col>
      </Row>

      <Row>
        <Col span={24}>&nbsp;</Col>
      </Row>


      <Row justify="center">
          <Col xs={12} lg={4} span={4} offset={1}>
              <h2>University of Washington Liaisons</h2>
          </Col>
          <Col xs={12} lg={12} span={12} offset={1}>
              <p>Abebe Aberra: Public Health Program Manager, Campus Preventive Health</p>
              <p>Andrea Benson: Head Chef at Local Point when project began</p>
              <p>Kara Carlson: Facilities Specialist for Dining Maintenance and Projects, Housing and Food Services</p>
              <p>Claudia Frere-Anderson: Director of UW Sustainability</p>
              <p>Gail S. Dykstra: Senior Technology Manager, Software, CoMotion Innovation Center</p>
              <p>Alicia Klein: Former Project and Purchasing Specialist for Dining at University of Washington, Housing and Food Services</p>
              <p>Lance LaFave: Manager Of Program Operations, Housing and Food Services Dining, Administration</p>
              <p>Torin Munro: Former Project and Purchasing Specialist for Dining at University of Washington, Housing and Food Services</p>
              <p>Kyle McDermott: UW Campus Sustainability Fund Coordinator</p>
              <p>Leah Pistorius: Communications Manager, Human Centered Design &amp; Engineering</p>
              <p>Amy Rosati: Program Assistant, UW Dining, Housing &amp; Food Services: By George, Orin’s Place, Mobile Dining Units</p>
              <p>Ian Rose: UW Campus Sustainability Fund Project Intern</p>
              <p>Espen Scheuer: ASUW Representative, Former UW Campus Sustainability Fund Committee Chair</p>
              <p>Sean Schmidt: UW Sustainability Specialist and ENVR 498</p>
              <p>Scott Smith: Copyright &amp; Trademark Manager, CoMotion Innovation Center</p>
              <p>Irini Spyridakis: Co-Founder, Director, and Faculty, Human Centered Design &amp; Engineering</p>
              <p>Laurne Terasaki: Administrative Specialist</p>
          </Col>
      </Row>
      <br/>
      <Row justify="center">
          <Col xs={12} lg={4} span={4} offset={1}>
              <h2>External Industry Board</h2>
          </Col>
          <Col xs={12} lg={12} span={12} offset={1}>
              <p>Madison Holbrook: Co-Founder, UW HCDE alumna, Hewlett Packard </p>
              <p>Ian Figon: UW INFO alumnus, Google </p>
              <p>Emma Graham: UW Political Economy &amp; Law, Societies &amp; Justice, &amp; Foster
                  School of Business alumna, American YouthWorks</p>
              <p>Joyce Huang: UW INFO alumna, IBM </p>
              <p>John Kaltenbach: UW CS alumnus, Sift Science</p>
              <p>Tzu-Ling (Ariel) Lin: UW CS alumna, Facebook</p>
              <p>Sanjana Prasain: UW CS alumna, Cisco</p>
              <p>Robert Watson: UW HCDE alumnus, Amazon</p>
          </Col>
      </Row>
      <br/>
      <Row justify="center">
          <Col xs={12} lg={4} span={4} offset={1}>
              <h2>Acknowledgements</h2>
          </Col>
          <Col xs={12} lg={12} span={12} offset={1}>
              <p>
                  We would like to thank the UW Campus Sustainability Fund (CSF) for its generous financial support and
                  also for its guidance throughout this project. Additionally, we are thankful and  honored to be 
                  <strong> voted the top CSF project of 2018 by the College of the Environment at the UW, leading to their annual class
                  gift of $5,000 for future CSF projects.</strong> We would also like to thank the multitude of students who worked
                  on this project this year as researchers, designers, developers, and service learning student deliverers;
                  without their tireless efforts, this project would not have succeeded. Additionally, we would like to thank
                  all the shelters and food banks that kindly offered us their time, educating us in the process. Finally, we
                  would like to thank the UW Housing and Food Services administrative and dining facilities’ staff for their
                  support and contributions. 
              </p>
          </Col>
      </Row>
    </div>
  );
}

function Media() {
  return(
    <div id="media">
      <Row justify="center">
        <Col span={16}>
          <Divider/>
        </Col>
      </Row>

      <Row >
        <Col offset={4}>
          <h1>MEDIA</h1>
        </Col>
      </Row>

      <Row justify="center">
        <Col xs={12} lg={4} offset={1}>
            <h2>Articles and Awards</h2>
        </Col>

        <Col xs={12} lg={12} offset={1}>
          <ol>
            <li>The Daily at the University of Washington, "
                <a href="http://www.dailyuw.com/news/article_44c57650-0d3d-11e8-bd9b-fb83e712a3ce.html">Student research group designs website to salvage campus food waste</a>"
                by Gabriela Tedeschi, The UW Daily, Feb 9, 2018.</li>
            <li>2018 Designing Up, "<a href="https://www.hcde.washington.edu/designing-up/2018/food-recovery">Building connections</a>"
                by Leah Pistorius. June 2018.</li>
            <li> University of Washington College of Engineering, “
                <a href="https://www.engr.washington.edu/node/2279/">Meal Matchup</a>
                ” By Leah Pistorius and Chelsea Yates. August 17, 2018 </li>
            <li> Meal Matchup article is also archived on the HCDE website, Campus Sustainability Fund, UW Sustainability, and UW
                Undergraduate Academic Affairs’ pages. </li>
            <li><a href="https://www.hcde.washington.edu/news/meal-matchup-video">Meal Matchup </a>
                promo video featured on the HCDE website, FB, and Twitter pages by Leah Pistorius. December 14, 2018</li>
            <li>Campus Sustainability Fund Summer Newsletter, “Meal Matchup program has now delivered more than 1,000 pounds of food
                to local shelters!” August 9, 2019 </li>
            <li>Voted top Campus Sustainability Fund (CSF) project by the University of Washington’s College of Environment: annual class
                gift of 2018 will be contributing a total of $5,000 to the CSF's general projects’ budget to fund additional projects.</li>
          </ol>
        </Col>
      </Row>
    </div>
  );
}

function Departments_Images() {
  return(
    <div id="departments">
      <Row justify="center">
        <Col span={16}>
          <Divider/>
        </Col>
      </Row>

      <Row justify="center" gutter={[48, 64]}>
          <Col md={12} lg={4} offset={1}>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1537865275088-W5USSPO8E29V5DU96VEM/ke17ZwdGBToddI8pDm48kBY-aiWiDh05wBcSA8ZI5EgUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYy7Mythp_T-mtop-vrsUOmeInPi9iDjx9w8K4ZfjXt2dnuekkPnuefhrAr_3NbNJVgGtvEqwfduMWptG5ahzjYp3WUfc_ZsVm9Mi1E6FasEnQ/HCDE-UW-signature-horizontal.jpg?format=1000w" alt= "hcde logo" style={{width:"20em"}}/>
          </Col>
          <Col md={12} lg={4} offset={1}>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1537865466516-HGM839Y09B9B6Y10AQXU/ke17ZwdGBToddI8pDm48kKfcRpELpJTMVXEGJw5pXnxZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIQG2-w_quo4rGuA-zZjeG5iPDN-X7AWcl2HFOMcTf6CsKMshLAGzx4R3EDFOm1kBS/ischool-primary-black.jpg?format=500w" alt= "ischool logo" style={{width:"20em"}}/>
          </Col>
          <Col md={12} lg={4} offset={1}>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1537865379306-DSMJWM12Y8B87K13E7VG/ke17ZwdGBToddI8pDm48kCZnUM3eYFIvp3CBTd3b8t8UqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYy7Mythp_T-mtop-vrsUOmeInPi9iDjx9w8K4ZfjXt2donuYffDBmwtrGX34Na6Z-eOso0B8bTkVpPSa_8SfsEQCjLISwBs8eEdxAxTptZAUg/allen_school.png?format=750w" alt= "CSE allen school logo" style={{width:"20em"}}/>
          </Col>
      </Row>

      <Row justify="center" gutter={[48, 64]}>
          <Col md={12} lg={4} offset={1}>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1537865423298-1CA8W40GSUDAQLX8PSXK/ke17ZwdGBToddI8pDm48kBwaTE789u6Ji0W6V-iAiTVZw-zPPgdn4jUwVcJE1ZvWEtT5uBSRWt4vQZAgTJucoTqqXjS3CfNDSuuf31e0tVH2EO3u-ZJGG2OedPf9YV2mPPzrzZNqxipWAmYFJwCw7-87Nsj43NRAr6WuWZv5DKs/coe.png?format=750w" alt= "college of the enviornment logo" style={{width:"20em"}}/>
          </Col>
          <Col md={12} lg={4} offset={1}>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1537865349228-TFN4NFFVGPD00FRD01R8/ke17ZwdGBToddI8pDm48kPZmYOT4vq-ReSALsbn2B2QUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKc2_1vix11DC8pJvQmxfZr1UnA6ieAI0d_q2UU9tqgIkYpTkQQglJvLmtopb3IHFzn/csf_logo-horz.jpg?format=750w" alt= "campus sustainability logo" style={{width:"20em"}}/>
          </Col>
          <Col md={12} lg={4} offset={1}>
              <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1537865405236-7D8HC03XWRADUWH0BRRH/ke17ZwdGBToddI8pDm48kF6u83dr1gWkFDToJv9tB5hZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpx5xCeEngcDofsRY5sRtzd6gT7_OEsb9dkl-bB8MZUWdsZLxrBd1Ae46gzMORFlcNE/hfs.jpg?format=750w" alt= "housing and food services logo" style={{width:"20em"}}/>
          </Col>
      </Row>
    </div>
  )
}

function About() {
  return (
    <div className="container">
        <Mission/>
        <SpringQPicture/>
        <How_It_Began/>
        <Photo_Gallery/>
        <Meal_Matchup_Team/>
        <Media/>
        <Departments_Images/>
    </div>
  );
}

export default About;
