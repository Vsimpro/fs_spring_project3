import "./Feed.css"

// Virtual cookies:
var cookies = {

}

// Store all of the ID's here.
var id_bank = []

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

// Create a card for the comment
function create_card(id, username, message) {
    let card = document.createElement("div")
    let canvas =  document.getElementById( "main_feed" );
    let user_handle = document.createElement("div");
        user_handle.className = "user_handle"

    let username_p = document.createElement("p");
        username_p.innerText = `@${username}`;
        username_p.className = "handle"

        user_handle.appendChild( username_p )

        // If a card is owned by a user, show controls
        if (username === cookies.username) {
            username_p.className = "my_handle"
    
            let deletion = document.createElement( "span" );
                deletion.className = "handlebar"
                deletion.innerText = "delete"
            
            let update = document.createElement( "span" );
                update.className = "handlebar"
                update.innerText = "update"

            user_handle.appendChild( update );
            user_handle.appendChild( deletion );

            // Add events to controls
            update.addEventListener( "click", function () {
                let card_id = this.parentElement.parentElement.id;
                window.location.href = `/update/${card_id}`
            });

            deletion.addEventListener( "click", function () {
                let card_id = this.parentElement.parentElement.id;
                window.location.href = `/delete/${card_id}`
            });

        }

    let message_content = document.createElement("p");
        message_content.innerText = message;
        message_content.className = "content"

    card.id = id
    card.className = "card"

    // Apply content into card
    card.appendChild(user_handle)
    card.appendChild(message_content)
   
    // Insert card into feed
    canvas.appendChild( card )
}


export default function Feed() {

    let cookies_ = check_cookies()
    cookies = cookies_

    // API request to get all of the messages.
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/getall")
    xhr.onload = function () {
        var data = "";
        try {
            data = JSON.parse(xhr.responseText);
        } catch (e) {
            console.log( "couldn't fetch data" )
        }
        // Go throught the data and create cards for each message.
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

    // Return no HTML: do everything with DOM.
    return (null);
}

export { create_card, check_cookies }