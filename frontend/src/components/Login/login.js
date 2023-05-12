import "./Login.css"


export default function Register_form() {
    return (
        <div class="login_form">
            <h1> Welcome back.  </h1>
            <p id="small_print"> Don't have an account? <a id="already_user" href="/signup"> sign up </a> </p>

            <p id="error_text" hidden> These credentials do not match any in our database. </p>

            <input name="Username" placeholder="Username.." />
            <br />
            <input name="Password" placeholder="Password.." type="password"/>
            <br />

            <button> Log in. </button>
        </div>
    );
}
