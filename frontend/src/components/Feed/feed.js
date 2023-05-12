import "./Feed.css"

// Store all of the ID's here.
var id_bank = []

function create_card(id, username, message) {
    let card = document.createElement("div")
    let canvas =  document.getElementById( "main_feed" );
    
    let user_handle = document.createElement("p");
        user_handle.innerText = `@${username}`;
        user_handle.className = "handle"

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
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8123/api/getall")
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
