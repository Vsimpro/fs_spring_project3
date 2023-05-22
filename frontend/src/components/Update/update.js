import "./Update.css"

var _id;
    
try {
    _id = window.location.pathname.split( "/" )[2];
    
} catch (e) {
    _id = null;
    console.log( e )
    console.log("This should not happen. Not sure what went wrong.")
}

function get_message() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/id/${_id}`);
    xhr.onload = function() {
        if (xhr.status === 200) { 
            var _data = JSON.parse( xhr.responseText ) 
            let _textarea = document.getElementsByClassName("message_box")[0]

            _textarea.value = _data["message"] 
            _textarea.disabled = false;
        }
    }

    if (_id == null) {
        return;
    }

    xhr.send()
    return 0;
}


function update_message() {
    var _textarea = document.getElementsByClassName("message_box")[0]
        _textarea.disabled = true;

    if (_id == null) {
        return;
    }
        
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `http://localhost:4321/api/update/${_id}`, true);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if ((xhr.status === 401) || 
                (xhr.status === 403) || 
                (xhr.status === 418) ) {
                
                    throw new Error( "API call failure" )
            }
            
            console.log( "succesfull.. redirecting" )
            window.location.href = "/"
        }

        xhr.send( JSON.stringify({
                "message" : _textarea.value
        }));

    } catch (e) {
        console.log( e )
        alert( "Something went wrong: Could not update your message." )
    }
}

export default function update_site() {

    get_message()

    return (
        <>
            <div id="message_controls">
                <p> Update your message: </p>
                    <textarea className="message_box" 
                              disabled 
                              maxLength="250"
                              defaultValue={ "loading .. "}></textarea>
                <br />
                <button name="update_button" onClick={ update_message }> update </button>
            </div>
        </>
    );
}
