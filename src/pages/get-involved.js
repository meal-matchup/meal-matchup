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
        <div id="mainNavWrapper" class="nav-wrapper" data-content-field="navigation-mainNav">
            <nav id="mainNavigation" data-content-field="navigation-mainNav" style={navStyle}>      
                <div class="collection" style={tabStyle}>
                    Contact
                </div>
                <div class="collection homepage" style={tabStyle}>
                    Home
                </div>
                <div class="collection" style={tabStyle}>
                    About
                </div>
                <div class="collection" style={tabStyle}>
                    How It Works
                </div>
                <div class="collection" style={tabStyle}>
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
        <header id="header" class="show-on-scroll" data-offset-el=".index-section" data-offset-behavior="bottom" role="banner" style={headerStyle}>
            <div class="header-inner" style={headerInnerStyle}>
                <div id="logoWrapper" class="wrapper" data-content-field="site-title">
                    <h1 id="logoImage" style={logoStyle}><a href="/"><img src={logoImage} alt="Meal Matchup" style={{width: "70px", height: "45px"}} /></a></h1>
                    <NavBar/>
                </div>
            </div>
        </header>
    );
}

function Get_Involved () {
    let containerStyle = { 
        background: "#fff", 
        fontSize: "16px"
    };
    return (
      <div className="container" style = {containerStyle}>
          <Header/>
      </div>
    );
}

export default Get_Involved;