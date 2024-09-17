import React, {useState} from "react";
import "./filter.css";
import "./filterComponent.css";

function Filter() {
    const [activeComponent, setActiveComponent] = useState("");
    const activeClass = "filter-component filter-component-active";
    const originalClass = "filter-component";

    function TestDiv() {
        return <div>
            <h1>Hello!</h1>
        </div>
    }
    
    function FilterComponent({str="ჩამოყარე", CustomDiv=TestDiv}) {
        const isActive = (activeComponent === str);
        return <div 
        className= {isActive ? activeClass : originalClass}  
        id={str} 
        onClick={() => isActive ? setActiveComponent("") : setActiveComponent(str)}>
            {str}
    
            <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.91232 0.337847C1.68451 0.110041 1.31516 0.110041 1.08736 0.337847C0.859552 0.565652 0.859552 0.934999 1.08736 1.1628L4.58736 4.6628C4.81516 4.89061 5.18451 4.89061 5.41232 4.6628L8.91232 1.1628C9.14012 0.934999 9.14012 0.565652 8.91232 0.337847C8.68451 0.110041 8.31516 0.110041 8.08736 0.337847L4.99984 3.42537L1.91232 0.337847Z" fill="#021526"/>
            </svg>
            <div id={str+"-dropdown"} className="filter-component-dropdown">
                {isActive ? <CustomDiv /> : null}
            </div>
        </div>
    }

    return <div class="filter" id="filter">
        <FilterComponent str="რეგიონი"/>
        <FilterComponent str="საფასო კატეგორია"/>
        <FilterComponent str="ფართობი"/>
        <FilterComponent str="საძინებლების რაოდენობა"/>
    </div>
}

export default Filter;