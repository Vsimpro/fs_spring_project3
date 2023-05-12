import "./Login.css"

function set_cookie(name_, password_) {
    document.cookie =  `username=${name_}`
    document.cookie =  `password=${password_}`
}


async function post_login(name_, password_) {
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:4321/api/login";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if ((xhr.status !== 401) && 
            (xhr.status !== 403) && 
            (xhr.status !== 418) ) {
        
            set_cookie(name_, password_)
            console.log( "Login Success" )
            return 0;
        }

        // TODO: Trigger Error in front;
        return null
    }
    
    var data = JSON.stringify({
        "username" : name_,
        "password" : password_
    });

    xhr.send(data);
}


function clickHandler() {
    
    let username = document.getElementById( "uname" ).value
    let password = document.getElementById( "passwd" ).value
    
    post_login( username, password )

}



export default function Register_form() {
    return (
        <div className="login_form">
            <h1> Welcome back.  </h1>
            <p id="small_print"> Don't have an account? <a id="already_user" href="/signup"> sign up </a> </p>

            <p id="error_text" hidden> These credentials do not match any in our database. </p>

            <input id="uname" name="Username" placeholder="Username.." />
            <br />
            <input id="passwd" name="Password" placeholder="Password.." type="password"/>
            <br />

            <button onClick={ clickHandler }> Log in. </button>
        </div>
    );
}
