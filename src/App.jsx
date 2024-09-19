import React, {useState, useEffect} from "react";
import Header from "./UI elements/Header/header";
import Card from "./UI elements/Card/card";
import Button from "./UI elements/Button/button";
import Filter from "./UI elements/Filter/filter";
import AgentForm from "./Forms/Agent/AgentForm";
import ListingForm from "./Forms/Listing/ListingForm";
import "./App.css";

function App() {
    // Create the data variable of all listings
    const [data, setData] = useState([]);
    const [state, setState] = useState("main");

    const mainState = () => {
        setState("main");
    }

    const showListing = (id) => {
        setState(`listing-${id}`);
    }

    // For toggling the agent form
    function toggleAgent() {
        const agentForm = document.getElementById("agent-form");
        agentForm.classList.toggle("hidden");
    }

    //
    useEffect(() => {
        fetchListings()
    }, [])

    // Fetching the data of all listings
    async function fetchListings() {
        const res = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/real-estates', {
            headers: {
              'accept': 'application/json',
              'Authorization': 'Bearer 9d07c60a-2a96-4377-a1a4-5b313b5d9773'
            }
          });

        // setData(["a", "a", "a", "a"]);
        setData(await res.json());
    }

    // If the current state is main
    function MainState() {
        return <div>
            <div className="filter-and-buttons">
                <Filter />
                <div className="btn-group">
                    <Button str="ლისტინგის დამატება" whenClicked={() => setState("listing-form")}/>
                    <Button str="აგენტის დამატება" primary={false} whenClicked={() => toggleAgent()}/>
                </div>
            </div>
            <div className="center-card-grid">
                <div className="all-cards">
                    {
                        data.length > 0 ? (data.map((e) => {
                            return <Card data={e} show={showListing}></Card>
                        }))
                        : (<p>აღნიშნული მონაცემებით განცხადება არ იძებნება</p>)
                    }
                </div>
            </div>
        </div>
    }

    return <div className="App">
        <Header refresh={mainState}/>
        
        {
            state === "main" ? (<MainState />) : null
        }

        {
            state === "listing-form" ? (<ListingForm backTo={mainState} />) : null
        }

        <AgentForm />
        
    </div>
}

export default App;