/* Imports */
const cors = require("cors");
const express = require("express");
const cookieParser = require('cookie-parser');
require("dotenv").config();

/* Modules */
var Connection = require("./modules/mongo.js")
var DATABASE = new Connection()

/* Global Variables */
const app = express();
      app.use(
        cors( {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials : true
        }));
      app.use(express.json());
      app.use(cookieParser());

let HOST = process.env.HOST
let PORT = process.env.PORT

/* Functions */
// check_permission : returns true if action is allowed, false if not.
async function check_permission(token) {
    // if neither is present in the token, deny access.
    if ( (!token["username"]) && (!token["password"]) ) {
        return false;
    }

    let exists = await find_user(token)

    if (exists != null) {
        console.log( exists )
        return true;
    }

    // By default deny access.
    return false;
}

// finds user token
async function find_user(token) {

    let user = token["username"];
    let passwd = token["password"]

    let user_in_db = await DATABASE.fetch_users(user, passwd);
    if (user_in_db == null) {
        return null;
    }

    if ((user_in_db["username"] == token["username"]) 
     && (user_in_db["password"] == token["password"])){
        return user;
    }

    return null;
}

// check if user exists.
async function user_exists(token) {

    let user = token["username"];
    let user_in_db = await DATABASE.user_exists(user);

    if (user_in_db == null) {
        return false;
    }

    if (user_in_db["username"] == token["username"]) {
        return true;
    }

    return false;
}

async function modify_content(data, id) {
    try {
        await DATABASE.patch(data, id)
    } catch (err) {
        console.log("[!] Error")
        console.log(err)
        return false
    }

    return true
}

async function delete_comment(id) {
    try {
       await DATABASE.delete(id)
    } catch (error) {
        console.log("[!] Error")
        console.log(error)
        return false
    }
    return true
}

// is_owner : check if user owns the resource 
async function is_owner(token, id) {
    let comments = await DATABASE.fetch_comments()

    if (find_user(token)["username"] == null) {
        return false;
    }

    for (let i = 0; i < comments.length; i++) {
        if ((comments[i]["id"] == id) && 
            (comments[i]["username"] == token["username"])) {
            return true;
        }
    }

    return false
}


/* Routes */
app.listen(PORT, function() { 
    console.log("[+] [Index] Server starting on http://" + HOST + ":" + PORT) 
});

/* No Auth needed */
// /api/getall : return all the comments. POST
app.get("/api/getall", async function(request, response){
    console.log("[>] [api] GET '/api/getall/'");
    try {
        //response.send(JSON.stringify(COMMENTS))
        let comments = await DATABASE.fetch_comments() 

        for (let i = 0; i < comments.length; i++) {
            comments[i] = {
                id : comments[i].id,
                username : comments[i].username,
                message : comments[i].message,
            }
        }
        response.send(JSON.stringify( comments ))
            
    } catch (error) {
        console.log("[!] Error")
        console.log(error)
        response.send("{'success' : false, error : 500}")
        return 1
    }
    
    return 0
});

// /api/:id : return comment with this id.
app.get("/api/id/:id", async function(request, response){
    let id = request.params.id
    console.log(`[>] [api] GET '/api/${id}'`);

    let comments = await DATABASE.fetch_comments();
    for (let i = 0; i < comments.length; i++) {

        if (comments[i]["id"] == id) {
            response.send(JSON.stringify( {
                id : comments[i].id,
                username : comments[i].username,
                message : comments[i].message,
            }));

            return 0;
        }
    }

    response.send("[{}]")
    return 1;
});


// /api/login 
app.post("/api/login", async function(request, response) {
    console.log("[>] [api] POST '/api/login/'");
    let data = request.body

    if ( (!data["username"]) || (!data["password"])) {
        response.status(401).send("{'success' : false}")
        return 1;
    }

    let user = data["username"];
    let passwd = data["password"]

    // this should never return null but it does?
    let saved_user = await DATABASE.fetch_users(user, passwd);
      
    if ((saved_user.username == user && saved_user.password == passwd)) {
        response.status(202).send("{'success' : true}")
        return 0
    }

    response.status(401).send("{'success' : false}")
    return 1;
});

app.post("/api/register", async function(request, response) {
    console.log("[>] [api] POST '/api/register/'");
    let data = request.body
    
    if ( (!data["username"]) || (!data["password"])) {
        response.status(418).send("{'success' : false}")
        return 1;
    }

    if (!data["password"].length > 5) {
        response.status(418).send("{'success' : false, 'reason' : 'password too short'}")
        return 1;
    }

    let exists = await user_exists(data)
    if (exists) {
        console.log("[>] [api] User already exists.");
        response.status(401).send("{'success' : false}")
        return 1;
    }

    await DATABASE.create_user(data["username"], data["password"])

    let created = await find_user(data)
    if (!created) {
        console.log("[>] [api] problem creating a new user..");
        response.status(418).send("{'success' : false}")
        return 1;
    }
    
    response.status(201).send("{'success' : true}")
    return 1;
});

/* Auth Locked */
// /api/add : add a new comment if auth key allows it. POST
app.post("/api/add/", async function(request, response) {
    let data = request.body
    let cookies = request.cookies;

    console.log("[>] [api] POST '/api/add/'");
    if ((data["message"].length > 255) || 
        (data["message"] == undefined) || 
        (data["message"] == "")) {
            response.status(418).send("{'success' : false, 'error' : 'wrongly sized comment'}")
            return 1;
        }

    if (await check_permission(cookies)) {
        DATABASE.post({
            "username" : cookies["username"],
            "message"  : data["message"],
        });

        response.status(201).send("{'success' : true}")
        return 0;
    }
       
    response.status(401).send("{'success' : false}")
    return 1;
});

// /api/update/:id : update earlier made comments. POST
app.post("/api/update/:id", async function(request, response) {
    let data = request.body;
    let id = request.params.id;
    let cookies = request.cookies;
    
    console.log(`[>] [api] POST '/api/update/${id}'`);
    console.log( data )

    let owner = await is_owner(cookies, id)
    if (!owner) {
        response.status(401).send("{'success' : false}")
        return 1;
    }

    if ( (data.length < 0) || (data.length > 255) ) {
        response.status(418).send("{'success' : false, 'reason' : 'message size not ok'}")
        return 1;
    }

    let status = await modify_content(data, id)
    if (!status) {
        response.status(401).send("{'success' : false}")
        return 1;
    }

    console.log(`[>] [api] Updated '${id}'`);
    response.status(202).send("{'success' : true}")
    return 0;
});

// /api/delete/:id delete a comment made earlier. POST
app.post("/api/delete/:id", async function(request, response) {
    let id = request.params.id
    let cookies = request.cookies;

    console.log(`[>] [api] POST '/api/delete/${id}'`);

    let owner = await is_owner(cookies, id)
    if (!owner) {
        response.status(401).send("{'success' : false}")
        return 1;
    }

    let status = await delete_comment(id)
    if (!status) {
        response.status(401).send("{'success' : false}")
        return 1;
    }
    
    console.log(`[>] [api] Deleted id : '${id}'`);
    response.status(202).send("{'success' : true}")
    return 0;
});

// Catch 404
app.get("/*", function(request, response) {
    console.log("[>] [Index] GET '/?', no page.");
    response.status(404).send("404"); 
    return 0; 
});