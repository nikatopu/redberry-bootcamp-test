import React, { useState, useEffect } from "react";
import Header from "./UI elements/Header/header";
import Card from "./UI elements/Card/card";
import Button from "./UI elements/Button/button";
import AgentForm from "./Forms/Agent/AgentForm";
import ListingForm from "./Forms/Listing/ListingForm";
import Listing from "./Listing";
import "./App.css";

function App() {
    // State for listings, regions, and UI state
    const [data, setData] = useState([]);
    const [state, setState] = useState("main");
    const [listingId, setListingId] = useState('');
    const [regionsArr, setRegionsArr] = useState([]);
    const [filter, setFilter] = useState({
        by_region: false,
        regions: [],
        by_price: false,
        prices: { minPrice: 0, maxPrice: 0 },
        by_area: false,
        areas: { minArea: 0, maxArea: 0 },
        by_bedrooms: false,
        bedrooms: 0,
    });

    const mainState = () => setState("main");

    const showListing = (id) => {
        setState("show-listing");
        setListingId(id);
    };

    const toggleAgent = () => {
        const agentForm = document.getElementById("agent-form");
        agentForm.classList.toggle("hidden");
    };

    const fetchRegions = async () => {
        try {
            const res = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/regions');
            setRegionsArr(await res.json());
        } catch (error) {
            console.log(error);
        }
    };

    const fetchListings = async () => {
        try {
            const res = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/real-estates', {
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Bearer 9d07c60a-2a96-4377-a1a4-5b313b5d9773'
                }
            });
            const listings = await res.json();
            const filteredListings = filterListings(listings);
            setData(filteredListings);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch regions and listings
    useEffect(() => {
        fetchRegions();
        fetchListings();
    }, []);

    // Filter listings by region
    const filterListings = (arr) => {
        const byRegion = filter.regions.length > 0;
        return arr.filter((listing) => byRegion ? filter.regions.includes(listing.city.region_id) : true);
    };

    // Handle region update for the filter
    const regionUpdate = (num) => {
        // Update filter state without causing a re-render of activeComponent
        setFilter((prevFilter) => {
            const isIncluded = prevFilter.regions.includes(num);
            const updatedRegions = isIncluded 
                ? prevFilter.regions.filter((regionId) => regionId !== num)
                : [...prevFilter.regions, num];
    
            return {
                ...prevFilter,
                regions: updatedRegions,
                by_region: updatedRegions.length > 0,
            };
        });
    };

    // Filter by region UI component
    function ByRegion() {
        return (
            <div className="filter-div" id="filter-by-region">
                <div className="regions-box">
                    <h3>რეგიონის მიხედვით</h3>
                    <div className="regions">
                        {regionsArr.map((el) => (
                            <label key={el.id}>
                                
                                <input
                                    type="checkbox"
                                    id={el.id}
                                    name={el.name}
                                    checked={filter.regions.includes(el.id)}
                                    onChange={() => regionUpdate(el.id)}
                                />
                                {el.name}
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="move-right">
                        <div className="btn-group">
                            <button className="btn-primary" onClick={() => fetchListings()}>არჩევა</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Display all of the active filters
    function ActiveFilters() {
        // A signle active filter
        function ActiveFilter({str, todo}) {
            return <div className="active-filter" onClick={() => todo()}>
                {str}

                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 4L3.5 11" stroke="#354451" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3.5 4L10.5 11" stroke="#354451" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

            </div>
        }

        // Return all active filters
        return <div className="all-active-filters">
            {/* First, return the region filters */}
            {
                filter.by_region ? filter.regions.map((region) => {
                    return <ActiveFilter str={regionsArr.find((obj) => obj.id === region).name} todo={() => regionUpdate(region)}/>
                }) : null
            }
        </div>
    }

    // The filter component
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
            id={str} >
                <div className="actual-button" onClick={() => isActive ? setActiveComponent("") : setActiveComponent(str)}> 
                    {str}
                
                    <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.91232 0.337847C1.68451 0.110041 1.31516 0.110041 1.08736 0.337847C0.859552 0.565652 0.859552 0.934999 1.08736 1.1628L4.58736 4.6628C4.81516 4.89061 5.18451 4.89061 5.41232 4.6628L8.91232 1.1628C9.14012 0.934999 9.14012 0.565652 8.91232 0.337847C8.68451 0.110041 8.31516 0.110041 8.08736 0.337847L4.99984 3.42537L1.91232 0.337847Z" fill="#021526"/>
                    </svg>
                </div>
                <div id={str+"-dropdown"} className="filter-component-dropdown" >
                    {isActive ? <CustomDiv /> : null}
                </div>
            </div>
        }
    
        return <div class="filter" id="filter">
            <FilterComponent str="რეგიონი" CustomDiv={ByRegion}/>
            <FilterComponent str="საფასო კატეგორია"/>
            <FilterComponent str="ფართობი"/>
            <FilterComponent str="საძინებლების რაოდენობა"/>
        </div>
    }

    // Main state UI component
    function MainState() {
        return (
            <div style={{display:"flex", flexDirection:"column-reverse"}}>
                <div className="center-card-grid">
                    <div className="all-cards">
                        {data.length > 0 ? (
                            data.map((listing) => <Card key={listing.id} data={listing} show={showListing} />)
                        ) : (
                            <p>აღნიშნული მონაცემებით განცხადება არ იძებნება</p>
                        )}
                    </div>
                </div>
                <ActiveFilters />
                <div className="filter-and-buttons">
                    <Filter />
                    <div className="btn-group">
                        <Button str="ლისტინგის დამატება" whenClicked={() => setState("listing-form")} />
                        <Button str="აგენტის დამატება" primary={false} whenClicked={() => toggleAgent()} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <Header refresh={mainState} />
            {state === "main" && <MainState />}
            {state === "listing-form" && <ListingForm backTo={mainState} />}
            {state === "show-listing" && <Listing back={mainState} current={listingId} showFunction={showListing} />}
            <AgentForm />
        </div>
    );
}

export default App;
