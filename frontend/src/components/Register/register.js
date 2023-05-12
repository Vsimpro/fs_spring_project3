import "./Register.css"


function button() {
    console.log(1)
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
