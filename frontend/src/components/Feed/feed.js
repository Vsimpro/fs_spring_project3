import "./Feed.css"

// Virtual cookies:
var cookies = {

}

// Store all of the ID's here.
var id_bank = []

function check_cookies() {
    var uname = null
    var pword = null

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

    return {
        username : uname,
        password : pword
    }
}

function create_card(id, username, message) {
    let card = document.createElement("div")
    let canvas =  document.getElementById( "main_feed" );
    
    let user_handle = document.createElement("p");
        user_handle.innerText = `@${username}`;
        user_handle.className = "handle"

        if (username === cookies.username) {
            user_handle.className = "my_handle"
        }

    let message_content = document.createElement("p");
        message_content.innerText = message;
        message_content.className = "content"


    card.id = id
    card.className = "card"

    card.appendChild(user_handle)
    card.appendChild(message_content)
   
    canvas.appendChild( card )
}


export default function Feed() {

    let cookies_ = check_cookies()
    cookies = cookies_

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:4321/api/getall")
    xhr.onload = function () {

        const data = JSON.parse(xhr.responseText);

        for (let i = 0; i < data.length; i++) {
            
            let id_ = data[ i ][ "id" ]
            if ( id_bank.includes( id_ ) ) {
                continue;
            }

            id_bank.push( id_ )

            create_card(
                data[i]["id"],
                data[i]["username"],
                data[i]["message"]
            );
        };
    };

    xhr.send()

    return (null);
}
