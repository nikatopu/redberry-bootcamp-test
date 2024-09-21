import React, { useState } from 'react';
import ByRegion from '../Filters/ByRegion';
import ByPrice from '../Filters/ByPrice';
import ByArea from '../Filters/ByArea';
import ByBedrooms from '../Filters/ByBedrooms';
import "./filter.css";

function Filter({ filter, setFilter }) {
    const [activeComponent, setActiveComponent] = useState("");

    const FilterComponent = ({ str, CustomDiv }) => {
        const isActive = activeComponent === str;
        return (
            <div className={isActive ? "filter-component filter-component-active" : "filter-component"} id={str}>
                <div className="actual-button" onClick={() => setActiveComponent(isActive ? "" : str)}>
                    {str}
                    <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.91232 0.337847C1.68451 0.110041 1.31516 0.110041 1.08736 0.337847C0.859552 0.565652 0.859552 0.934999 1.08736 1.1628L4.58736 4.6628C4.81516 4.89061 5.18451 4.89061 5.41232 4.6628L8.91232 1.1628C9.14012 0.934999 9.14012 0.565652 8.91232 0.337847C8.68451 0.110041 8.31516 0.110041 8.08736 0.337847L4.99984 3.42537L1.91232 0.337847Z" fill="#021526"/>
                    </svg>
                </div>
                <div className='filter-component-dropdown'>
                    {isActive && <CustomDiv filter={filter} setFilter={setFilter} />}
                </div>
            </div>
        );
    };

    return (
        <div className="filter" id="filter">
            <FilterComponent str="რეგიონი" CustomDiv={ByRegion} />
            <FilterComponent str="საფასო კატეგორია" CustomDiv={ByPrice} />
            <FilterComponent str="ფართობი" CustomDiv={ByArea} />
            <FilterComponent str="საძინებლების რაოდენობა" CustomDiv={ByBedrooms} />
        </div>
    );
}

export default Filter;
