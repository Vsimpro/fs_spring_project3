import React from "react";

// Components
import Login from "./components/Login/login"
import Update from "./components/Update/update"
import Deletion from "./components/Deletion/deletion"
import Register from "./components/Register/register"
import NavigationBar from "./components/Navigation/navigationbar";


// Global CSS
import "./css/stylesheet.css"
import Feed from "./components/Feed/feed";

// Main function
function App() {
    var _html;
    var _location = window.location.pathname

    // Check only the first dir
    switch (_location.split("/")[1]) {
        /* Credentials */
        case ("login"):
            _html = (
                <>
                    <NavigationBar />
                    <Login /> 
                </>
            );
            break;

        case ("signup"):
            _html = (
                <>
                    <NavigationBar />
                    <Register />
                </>
            );
            break;
        
        /* Content modifying */
        case ("update"):
            _html = (
                <>
                    <NavigationBar />
                    <Update />
                </>
            )
            break;

        case ("delete"):
            _html = (
                <>
                    <Deletion />
                </>
            )
            break;
        
        // Home by default
        default:
            _html = (
                <>
                    <NavigationBar />
                    <div id="main_feed">
                    </div>
                    <Feed />
                </>
            )
    }

    
    /* Credentials */
    return ( _html )
}

export default App;
