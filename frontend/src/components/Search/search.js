import "./Search.css"
import { create_card } from "./../Feed/feed"

var id_bool   = true
var text_bool = false

function search() {
    var xhr = new XMLHttpRequest();
    
    let _value = document.getElementById( "query" ).value
    let _error = document.getElementById( "error" )
    let _results = document.getElementById( "results" )
    let _cards = document.getElementById( "main_feed" )

    _cards.innerHTML = ""
    _results.innerText  = ""
    
    try {
        // Check that Query is properly sized.
        if (_value.length < 1) {
            _error.innerText = "Box can't be empty!"
            return;
        }

        if (_value.length > 255) {
            _error.innerText = "Text or id too long!"
            return;
        }

        // In case of no error, clear 
        _error.innerText = "";


        // If ID is not hidden:
        if (!id_bool) {
            let _id = parseInt(_value)

            // Check if ID is a number
            let regex = /[a-zA-Z]/
            if (( isNaN(_id) ) || regex.test( _value ) ) {
                _error.innerText = "ID must be a number"
                return;
            }

            xhr.open("GET", "http://localhost:4321/api/id/" + _id)
            xhr.onload = function () {
                let _count = 1
                var data = JSON.parse(xhr.responseText);
                
                if ( data["id"] === undefined ) {
                    _results.innerText = `0 found.`
                    return;
                }

                create_card(
                    data["id"],
                    data["username"],
                    data["message"]
                )

                _results.innerText = `${_count} found.`
            }
            xhr.send()
            return;
        }

        // If ID is hidden, use Text:  
        
        // Get all of the messages, then search which include the query text:
        xhr.open("GET", "/api/getall")
        xhr.onload = function () {
            let _count = 0
            var data = JSON.parse(xhr.responseText);

            for (let i = 0; i < data.length; i++) {
            
                if ( data[i]["message"].toLowerCase().includes( _value.toLowerCase() )) {
                    create_card(
                        data[i]["id"],
                        data[i]["username"],
                        data[i]["message"]
                    )
                    _count++;
                }
            
            }

            _results.innerText = `${_count} found.`
        }

        xhr.send()
        return;

    } catch (e) {
        console.log( e )
        alert("Sorry.. something went wrong")
    }

}

function toggle() {
    var _id = document.getElementById( "ID" )
    var _text = document.getElementById( "Text" )
    var _toggle = document.getElementById( "toggle" )
    
    if (id_bool) {

        id_bool   = false;
        text_bool = true;

        _id.hidden   = id_bool
        _text.hidden = text_bool;

        _toggle.innerText = " Search by Text instead? "
        return;
    }

    id_bool   = true;
    text_bool = false;

    _id.hidden   = id_bool
    _text.hidden = text_bool;
    _toggle.innerText = " Search by ID instead? "
    return;

}

export default function Searchbar() {

     id_bool   = true
     text_bool = false
    
    return (
        <>

            <input id="query" placeholder="Search messages.." />
            <button id="ID"     className="ID"     type="button" onClick={ search } hidden>      Search ID </button>
            <button id="Text"   className="text"   type="button" onClick={ search }>  Search Text </button>
            <button id="toggle" className="toggle" type="button" onClick={  toggle  }> Search by ID instead? </button>

            <div id="error" />
            <div className="search_results" id="results" />
            <div id="main_feed" />
        </>
    );
}
