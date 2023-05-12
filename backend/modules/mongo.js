// Imports
require("dotenv").config();
const Mongoose = require("mongoose");
const { default: mongoose } = require("mongoose");

/* Global Vars */
var Schema = mongoose.Schema;

var comments_schema = new Schema({
    id : Number,
    username : String,
    message  : String,
}, {collection : "comments"})

var Comment = mongoose.model( "Comment", comments_schema );

var user_schema = new Schema({
    username     : String,
    password     : String,
    
}, {collection : "users"})

var User = mongoose.model( "User", user_schema );

class Connection {
    constructor() {
        this.inserts = 0
        this.data_pool = [];

        this.db_password = process.env.MONGO_PASSWD;
        this.db_username = process.env.MONGO_USERNAME;

        this.uri = "mongodb+srv://" + this.db_username + ":" + this.db_password +  "@fullstackcluster.awpvpm2.mongodb.net/collection";
        
        try {
            this.connect()
            this.fetch_comments()
        } catch(error) {
            console.log("[!] [Mongo] Could not connect to the Database while initialising.")
        }
    }

    connect() {
        try {
            Mongoose.connect( this.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            console.log("[+] [Mongo] Connection made. ")

        } catch (error) {
            // TODO: Find out why.
            console.log("[!] [Mongo] Can't connect to MongoDB.")
        }
    }

    async create_user(username_, password_) {
        try {
            console.log(username_, password_)
            await new User({
                username : username_,
                password : password_
            }).save()
        } catch (err) {
            console.log("[!] [Mongo] Couldn't create user")
            console.log(err)
            
            return 1;
        }
        
        return 0;
    }

    async fetch_users(username_, password_) {
        if ((username_ == null) || (password_ == null)) {
            return {username : null, password : null}
        }

        var user = await User.findOne({
            username : username_,
            password : password_
        });

        return user || {username : null, password : null}
    };

    async user_exists(username_) {
        if (username_ == null)  {
            return null
        }

        var user = await User.findOne({
            username : username_,
        });

        return user
    };

    async fetch_comments() {
        var comments = await Comment.find({});
        
        this.data_pool = comments
        this.inserts = this.data_pool.length

        return comments
    };

    // TODO: Insert desired data
    post(data) {
        try {
            this.inserts = 0
            if (this.data_pool.length > 0) {
                this.data_pool.forEach(element => {
                    if (element.id >= this.inserts) {
                        this.inserts = element.id + 1
                    }
                });
            }

            let new_comment = new Comment({
                id : this.inserts,
                username : data["username"],
                message  : data["message"]
            })

            new_comment.save()

        } catch (err) {
            console.log("[!] [Mongo] Could not insert a doc.")
            console.log(err)
            return 1;
        }

        return 0;

    };

    // TODO: Update desired data
    async patch(data, id_) {

        try {
            await Comment.updateOne(
                { id : id_ },
                { message : data["message"] 
            });
        } catch (err) {
            console.log("[!] [Mongo] Error patching.")
            console.log(err)
            return 1;
        }

        return 0;
    };

    async delete(id_) {
        try {
            await Comment.deleteOne( { id : id_} )

        } catch (err){
            console.log("[!] [Mongo] Error deleting.")
            console.log(err)
            return 1;
        }

        return 0;
    }
}

module.exports = Connection