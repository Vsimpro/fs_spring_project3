import "./Navbar.css"

export default function NavigationBar() {
    return (
        <div className="navbar">
            <p> <span className="heading"> Chirpper </span>
            <a href="/"       className="active">home</a>
            <a href="/login"  className="active">login</a>
            <a href="/signup" className="active">register</a>
            </p>
        </div>
    )
}
