import "./Status.css"

function check_cookies() {
    var uname = null
    var pword = null

    // Parse Cookies for password and username
    var cookies = document.cookie.split(";");
    if (cookies.length === 2) {
        if (cookies[0].split("=")[0] === "password") {
            pword = cookies[0].split("=")[1];
            uname = cookies[1].split("=")[1];
        }

        if (cookies[0].split("=")[0] === "username") {
            pword = cookies[1].split("=")[1];
            uname = cookies[0].split("=")[1];
        }
    }

    // Return Parsed cookies.
    return {
        username : uname,
        password : pword
    }
}

function send_message() {

    var _input = document.getElementById( "input" ).value

    if (_input.length > 255) {
        alert("Status update too long! Maximum length is 255.")
    }
    
    if (_input.length < 1) {
        alert("Status update too long! Minimum length is 1.")
    }

    var xhr = new XMLHttpRequest();

    try {
        xhr.open("POST", "/api/add", true);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if ((xhr.status === 401) || 
                (xhr.status === 403) || 
                (xhr.status === 418) ) {
                
                    alert( "Something went wrong" )
                
            }

            window.location.reload();
        }

        var data = JSON.stringify({
            "message" : _input
        });

        xhr.send(data);

    } catch (e) {
        console.log( e )
        alert( "Something went wrong" )
    }

}

var cookies = check_cookies()
export default function Status() {

    if (cookies.username) {

        return ( 
            <form>
                <div className="status_update"> 
                    <input min="0" max="255" id="input" placeholder="What's up?"/>
                    <button type="button" onClick={ send_message } > send </button> 
                </div>
            </form>
         );
    };

    return (null);
}