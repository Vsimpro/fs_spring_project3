import "./Register.css"

function set_cookie(name_, password_) {
    document.cookie =  `username=${name_}`
    document.cookie =  `password=${password_}`
}


function button() {

    let username_ = document.getElementsByName("Username")[0].value
    let password_ = document.getElementsByName("Password")[0].value


    var xhr = new XMLHttpRequest();
    var url =  "/api/register";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        console.log(xhr.statusText)
        if ((xhr.status !== 401) && 
            (xhr.status !== 403) && 
            (xhr.status !== 418) ) {
            
            window.location.assign("/login")
            
            return 0;
        }

        alert("Something went wrong when registering.")
    }
    
    var data = JSON.stringify({
        "username" : username_,
        "password" : password_
    });

    xhr.send(data);
}


export default function Register_form() {
    return (
        <div className="register_form">
            <h1> Create a new account  </h1>
            <p id="small_print"> Already have an account? <a id="already_user" href="/login"> log in </a> </p>

            
            <input name="Username" placeholder="Username.." />
            <br />
            <input name="Password" placeholder="Password.." type="password"/>
            <br />

            <button onClick={ button }> Create an account. </button>

        </div>
    );
}
