import React from "react";

// Components
import Login from "./components/Login/login"
import Register from "./components/Register/register"
import NavigationBar from "./components/Navigation/navigationbar";


// Global CSS
import "./css/stylesheet.css"
import Feed from "./components/Feed/feed";

// Main function
function App() {

    // Funky naming I know
    let where_abouts = window.location.pathname

    // Login
    if (where_abouts === "/login") {
        return (
            <>
                <NavigationBar />
                <Login /> 
            </>
        )
    }

    // Register
    if (where_abouts === "/signup") {
        return (
            <>
                <NavigationBar />
                <Register />
            </>
        )
    }

    // Home by default
    return (
        <>
            <NavigationBar />
            <Feed />
            <div id="main_feed">
            </div>
        </>
    )
}

export default App;
