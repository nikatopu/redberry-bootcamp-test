import React, { act } from "react";
import "./filterComponent.css"

function FConClick(id) {
    // Get this element's data and the child element's data
    const theDiv = document.getElementById(id);
    const childDiv = document.getElementById(id + "-dropdown");
    const activeStyle = "filter-component-active";

    // If the data was not given, return null to avoid errors
    if (theDiv == null) {
        return null;
    }

    // Clear ever filter's css
    const theFilter = document.getElementById("filter");
    theFilter.childNodes.forEach((e) => {
        e.classList.remove(activeStyle);
        e.childNodes.forEach(e => e.hidden = true)
    })

    // Toggle the dropdown menu
    if (theDiv.classList.contains(activeStyle)) {
        theDiv.classList.remove(activeStyle);
        childDiv.hidden = true;
    } else {
        theDiv.classList.add(activeStyle);
        childDiv.hidden = false;
    }

}

function TestDiv() {
    return <div>
        <h1>Hello!</h1>
    </div>
}

function FilterComponent({str="ჩამოყარე", CustomDiv=TestDiv}) {
    return <div className="filter-component" id={str} onClick={() => FConClick(str)}>
        {str}

        <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.91232 0.337847C1.68451 0.110041 1.31516 0.110041 1.08736 0.337847C0.859552 0.565652 0.859552 0.934999 1.08736 1.1628L4.58736 4.6628C4.81516 4.89061 5.18451 4.89061 5.41232 4.6628L8.91232 1.1628C9.14012 0.934999 9.14012 0.565652 8.91232 0.337847C8.68451 0.110041 8.31516 0.110041 8.08736 0.337847L4.99984 3.42537L1.91232 0.337847Z" fill="#021526"/>
        </svg>
        <div id={str+"-dropdown"} className="filter-component-dropdown" hidden>
            <CustomDiv />
        </div>
    </div>
}

export default FilterComponent;