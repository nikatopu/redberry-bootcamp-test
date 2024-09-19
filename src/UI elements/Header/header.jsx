import React from "react";
import "./header.css"

function Header({refresh}) {
    return <header>
        <img src={"./redberry-logo.png"} alt="redberry-logo" onClick={() => refresh()}/>
    </header>;
}

export default Header;