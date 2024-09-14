import React from "react";
import FilterComponent from "./FilterComponents/filterComponent";
import "./filter.css";

function Filter() {
    return <div class="filter" id="filter">
        <FilterComponent str="რეგიონი"/>
        <FilterComponent str="საფასო კატეგორია"/>
        <FilterComponent str="ფართობი"/>
        <FilterComponent str="საძინებლების რაოდენობა"/>
    </div>
}

export default Filter;