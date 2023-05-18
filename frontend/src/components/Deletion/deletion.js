import "./Deletion.css"

var data;
var id;
    
try {
    id = window.location.pathname.split( "/" )[2];
    
} catch (e) {
    id = null;
    console.log( e )
    console.log("This should not happen. Not sure what went wrong.")
}

function delete_message() {
    // Todo: Send deletion.
    go_back()
}

function get_message() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:4321/api/id/${id}`);
    xhr.onload = function() {
        if (xhr.status === 200) { 
            data = JSON.parse( xhr.responseText ) 
            write_card()
        }
    }

    if (id == null) {
        return;
    }

    xhr.send()
    return 0;
}

function write_card() {
    let username = data["username"] || "";
    let message =  data["message"]  || "";

    let card = document.createElement("div")
    let canvas =  document.getElementById( "card" );
    let user_handle = document.createElement("div");
        user_handle.className = "user_handle"

    let username_p = document.createElement("p");
        username_p.innerText = `@${username}`;
        username_p.className = "handle"

        user_handle.appendChild( username_p )


    let message_content = document.createElement("p");
        message_content.innerText = message;
        message_content.className = "content"

    card.className = "card"

    // Apply content into card
    card.appendChild(user_handle)
    card.appendChild(message_content)
   
    // Insert card into feed
    canvas.appendChild( card )

    return 0;
}

function go_back() {
    window.location.href = "/" 
}

export default function deletion() {

    get_message()
    //write_card() 

    return (
        <>
        <div className="confirmation_box">
            <h1> Are you certain you want to delete this post? </h1>
            <p> It will be lost for ever! (a long time.) </p>

            <div id="card" />

            <button name="yes"    className="confirm" onClick={ delete_message }> yes I'm certain.</button>
            <button name="cancel" className="cancel" onClick={ go_back }>no, take me back</button>
        </div>
        </>
    );
}