import React, {useState} from "react";
import Header from "./UI elements/Header/header";
// import Card from "./UI elements/Card/card";
import Button from "./UI elements/Button/button";
import Filter from "./UI elements/Filter/filter";
import AgentForm from "./Forms/Agent/AgentForm";
import "./App.css";

function App() {
    function toggleAgent() {
        const agentForm = document.getElementById("agent-form");
        agentForm.classList.toggle("hidden");
    }

    return <div className="App">
        <Header />
        <div className="filter-and-buttons">
            <Filter />
            <div className="btn-group">
                <Button str="ლისტინგის დამატება"/>
                <Button str="აგენტის დამატება" primary={false} whenClicked={toggleAgent}/>
            </div>
        </div>

        <AgentForm />
        
    </div>
}

export default App;