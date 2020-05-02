import React from 'react';
import './about.css';
import { Container, Row, Col } from 'react-grid-system';
import springqphoto from "./spring.jpeg";
import cse from "./allen_school.png";
import coe from "./coe.png";
import csf from "./csf_logo.jpg";
import hcde from "./hcde.jpg";
import hfs from "./hfs.jpg";
import ischool from "./ischool.jpg";
 

function Our_Mission() {
  return(
      <div id="mission-statement">
          <Container>
              <Row noGutters={false}>
                  <Col sm={3}>
                      <h1>OUR MISSION</h1>
                  </Col>

                  <Col sm={9}>
                      <Row>
                          <p> Our goal is to strengthen sustainable food practices through our interactive, responsive, open source website
                              at the University of Washington (UW) by connecting dining hall and shelter managers with service learning student
                              food deliverers and in doing so: </p>
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
          </Container>
      </div>
  );
}

function Photo_Caption() {
  return(
      <div id="photo-caption">
          <Container>
              <Row>
                  <Col>
                      <Row><img className="springqphoto" src={springqphoto} alt= "spring quarter photo"/></Row>
                    
                      <Row>
                          <p> Spring quarter with undergraduate and graduate students from Human Centered Design
                              &amp; Engineering, the Information School, and the Paul G. Allen School of Computer Science
                              and Engineering</p>
                      </Row>
                  </Col>
              </Row>
              <div className="section-divider-large"></div>
          </Container>
      </div>
  );
}

function How_It_Began() {
  return(
      <div id="how-it-began">
          <Container>
              <Row>
                  <Col sm={3}>
                      <h1>HOW IT BEGAN</h1>
                  </Col>

                  <Col sm={9}>
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
              <div className="section-divider-medium"></div>
              <hr/>
            
          </Container>
      </div>
  );
}


function Photo_Gallery() {
  return(
      <div id="photo-gallery">
          <Container>
            <div className="section-divider-medium"></div>
              <Row>
                <Col>
                  <h1>Photo Gallery</h1>
                </Col>
              </Row>
            <div className="section-divider-medium"></div>
            <hr/>
          </Container>
      </div>
  )
}

function Meal_Matchup_Team() {
  return(
      <div id="how-it-began">
            <Container>
                <div className="section-divider-medium"></div>
                <Row>
                    <Col>
                    <h1>MEAL MATCHUP TEAM MEMBERS</h1>
                    </Col>
                </Row>
                <div className="section-divider-large"></div>

                <Row>
                    <Col sm={4}>
                        <h2>University of Washington Liaisons</h2>
                    </Col>
                    <Col sm={8}>
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
                <Row>
                    <Col sm={4}>
                        <h2>External Industry Board</h2>
                    </Col>
                    <Col sm={8}>
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
                <Row>
                    <Col sm={4}>
                        <h2>Acknowledgements</h2>
                    </Col>
                    <Col sm={8}>
                        <p>
                            We would like to thank the UW Campus Sustainability Fund (CSF) for its generous financial support and
                            also for its guidance throughout this project. Additionally, we are thankful and  honored to be 
                            <strong>voted the top CSF project of 2018 by the College of the Environment at the UW, leading to their annual class
                            gift of $5,000 for future CSF projects.</strong> We would also like to thank the multitude of students who worked
                            on this project this year as researchers, designers, developers, and service learning student deliverers;
                            without their tireless efforts, this project would not have succeeded. Additionally, we would like to thank
                            all the shelters and food banks that kindly offered us their time, educating us in the process. Finally, we
                            would like to thank the UW Housing and Food Services administrative and dining facilities’ staff for their
                            support and contributions. 
                        </p>
                    </Col>
                </Row>
                <hr/>


          </Container>
      </div>
  );
}



function Media() {
  return(
      <div id="media">
        <Container>
            <div className="section-divider-medium"></div>

            <Row>
                <Col>
                    <h1>MEDIA</h1>
                </Col>
            </Row>

            <Row justify="center">
                <Col sm={3}>
                    <h2>Articles and Awards</h2>
                </Col>

                <Col sm={9}>
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
            <div className="section-divider-medium"></div>
            <hr/>
            <div className="section-divider-medium"></div>

        </Container>
      </div>
  );
}

function Departments_Images() {
  return(
      <div id="departments">
          <Container>
              <Row>
                  <Col sm={4}>
                      <img src={hcde} alt= "hcde logo"/>
                  </Col>
                  <Col sm={4}>
                      <img src={ischool} alt= "ischool logo"/>
                  </Col>
                  <Col sm={4}>
                      <img src={cse} alt= "CSE allen school logo"/>
                  </Col>
              </Row>
              <Row>
                  <Col sm={4}>
                      <img src={coe} alt= "college of the enviornment logo"/>
                  </Col>
                  <Col sm={4}>
                      <img src={csf} alt= "campus sustainability logo"/>
                  </Col>
                  <Col sm={4}>
                      <img src={hfs} alt= "housing and food services logo"/>
                  </Col>
              </Row>
          </Container>
      </div>
  )
}


function About() {
  return (
    <Container>
      <Our_Mission/>
      <Photo_Caption/>
      <How_It_Began/>
      <Photo_Gallery/>
      <Meal_Matchup_Team/>
      <Media/>
      <Departments_Images/>
    </Container>
  );
}

export default About;
