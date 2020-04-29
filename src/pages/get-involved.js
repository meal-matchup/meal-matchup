import React, { Component } from 'react';

function NavBar () {
    let navStyle = {
        display: "flex", 
        justifyContent: "flex-end",
        color: "rgba(26, 26, 26, 0.7)",
        font: "18px proxima-nova"
    }
    let tabStyle = {
        color: "rgba(0, 0, 0, 0.9)",
        font: "12px proxima-nova",
        padding: "9px 12px",
        fontWeight: "700",
        fontStyle: "normal",
        letterSpacing: "2.78px",
        textTransform: "uppercase",
        textDecoration: "none",
        lineHeight: "1em"
    }
    return (
        <div id="mainNavWrapper" className="nav-wrapper" data-content-field="navigation-mainNav">
            <nav id="mainNavigation" data-content-field="navigation-mainNav" style={navStyle}>      
                <div className="collection" style={tabStyle}>
                    Contact
                </div>
                <div className="collection homepage" style={tabStyle}>
                    Home
                </div>
                <div className="collection" style={tabStyle}>
                    About
                </div>
                <div className="collection" style={tabStyle}>
                    How It Works
                </div>
                <div className="collection" style={tabStyle}>
                    Get Involved
                </div>
            </nav>
        </div>
    );
}

function Header () {
    let logoImage = "//static1.squarespace.com/static/5aee05b75cfd79f523e4daf6/t/5ced930d104c7b1fe213c959/1582793180802/?format=1500w";
    let headerInnerStyle = {
        padding: "20px 0",
        display: "table",
        width: "100%",
        boxSizing: "border-box"
    }
    let logoStyle = {
        height: "auto",
        maxHeight: "100px",
        width: "auto",
        maxWidth: "100%"
    }
    let headerStyle = {
        padding: "0 20px",
        boxSizing: "border-box",
        zIndex: "1000",
        top: "0",
        left: "0",
        width: "100%",
        lineHeight: "1em",
        backgroundColor: "#f7f7f7",
        position: "relative"
    }
    return (
        <header id="header" className="show-on-scroll" data-offset-el=".index-section" data-offset-behavior="bottom" role="banner" style={headerStyle}>
            <div className="header-inner" style={headerInnerStyle}>
                <div id="logoWrapper" className="wrapper" data-content-field="site-title">
                    <h1 id="logoImage" style={logoStyle}><a href="/"><img src={logoImage} alt="Meal Matchup" style={{width: "70px", height: "45px"}} /></a></h1>
                    <NavBar/>
                </div>
            </div>
        </header>
    );
}

function Main () {
    return (
        <main id="page" role="main" style={{display: "block"}}>
            <div id="item_container">
                <div className="item_wrapper">
                    <div className="item">
                        <h1>Food Recovery in Your Community</h1>
                        <p>
                            Start or expand food recovery efforts in your campus, community or city. Contact our Coordinator and see how Meal Matchup or similar practices can apply to your community.
                        </p>
                    </div>
                    <div className="img_wrapper"> 
                        <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1528070452083-D90RHP9TOH5SJ2G05N0T/ke17ZwdGBToddI8pDm48kNZr331BLc-Rota1ZP1Yh3h7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0hReLB75oIvKxcDxwlnLXaYNPa96OWO5Z21xzWqpQF_bv3E39NLc0xdQYNJZ7z0n0g/salad+bar.JPG"></img>
                    </div>
                </div>
                <hr></hr>
                <div className="item_wrapper">
                    <div className="item">  
                        <h1>Join Meal Matchup at the University of Washington</h1>
                        <p>Join Meal Matchup at the University of Washington Seattle campus as a dining hall, volunteer, or non-profit organization. Contact our Coordinator to learn more about how Meal Matchup works and if Meal Matchup would be a good fit for you or your organization.</p>
                    </div>
                    <div className="img_wrapper">
                        <img src="https://images.squarespace-cdn.com/content/v1/5aee05b75cfd79f523e4daf6/1526458179015-8A4YGBAK2ZJAK7SAO85X/ke17ZwdGBToddI8pDm48kK60W-ob1oA2Fm-j4E_9NQB7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0kD6Ec8Uq9YczfrzwR7e2Mh5VMMOxnTbph8FXiclivDQnof69TlCeE0rAhj6HUpXkw/ashley-whitlatch-569234-unsplash.jpg"></img>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Footer () {
    return (
        <div className="footer">
            <h2> Hello</h2>
        </div>
    );
}

function Get_Involved () {
    return (
      <div className="container">
          <Header/>
          <Main/>
          <Footer/>
      </div>
    );
}

export default Get_Involved;