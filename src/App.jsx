import React, { useState, useEffect } from "react";
import Header from "./UI elements/Header/header";
import Card from "./UI elements/Card/card";
import Button from "./UI elements/Button/button";
import AgentForm from "./Forms/Agent/AgentForm";
import ListingForm from "./Forms/Listing/ListingForm";
import Listing from "./Listing";
import Filter from "./Filter/filter";
import ActiveFilters from "./Filter/Filters/ActiveFilters";
import "./App.css";

function App() {
    // Different States
    const [data, setData] = useState([]);               // The data to show - filtered (or not) listings
    const [state, setState] = useState("main");         // What state are we in? (For changing "pages")
    const [listingId, setListingId] = useState('');     // The id of the listing we are currently seeing
    const [regionsArr, setRegionsArr] = useState([]);   // The array holding all of the regions
    const [filter, setFilter] = useState({              // The filter object we use to filter through the listing
        by_region: false,
        regions: [],
        by_price: false,
        prices: { minPrice: 0, maxPrice: 0 },
        by_area: false,
        areas: { minArea: 0, maxArea: 0 },
        by_bedrooms: false,
        bedrooms: 0,
    });

    // Different states
    const mainState = () => setState("main");

    const showListing = (id) => {
        setState("show-listing");
        setListingId(id);
    };

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
                <ActiveFilters filter={filter} setFilter={setFilter} regions={regionsArr}/>
                <div className="filter-and-buttons">
                    <Filter filter={filter} setFilter={setFilter} />
                    <div className="btn-group">
                        <Button str="ლისტინგის დამატება" whenClicked={() => setState("listing-form")} />
                        <Button str="აგენტის დამატება" primary={false} whenClicked={() => toggleAgent()} />
                    </div>
                </div>
            </div>
        );
    }

    // Toggling the agent div
    const toggleAgent = () => {
        const agentForm = document.getElementById("agent-form");
        agentForm.classList.toggle("hidden");
    };

    // Fetching appropriate data
    const fetchRegions = async (event) => {
        try {
            const res = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/regions');
            setRegionsArr(await res.json());
        } catch (error) {
            console.log(error);
        }
    };

    const fetchListings = async (event) => {
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

    useEffect(() => { // Fetch on load
        fetchRegions();
        fetchListings();
    }, []);

    // Fetch the listings after any major change is made to the filter
    useEffect(() => {
        fetchListings();
    }, [filter.by_area, filter.bedrooms, filter.by_price, filter.regions]);

    // Comparing units
    const compareUnits = (min, max) => {
        // Parse the integers
        const min_p = parseInt(min);
        const max_p = parseInt(max);

        // Return false if either is null or undefined
        if (min_p === null || min_p === undefined || max_p === null || max_p === undefined) {
            return false;
        }

        // Return false if max is 0 or below 0
        if (max_p <= 0) {
            return false
        }

        // Return false if min p is smaller than 0
        if (min_p < 0) {
            return false
        }

        // Return false if min p is greater than max p
        if (max_p < min_p) {
            return false
        }

        // For any other case, return true
        return true;
    }

    // Filter listings by region
    const filterListings = (arr) => {
        const byRegion = filter.regions.length > 0;
        const byPrice = compareUnits(filter.prices.minPrice, filter.prices.maxPrice);
        const byArea = compareUnits(filter.areas.minArea, filter.areas.maxArea);
        const byBedrooms = filter.bedrooms > 0;
        return arr.filter((listing) => byRegion ? filter.regions.includes(listing.city.region_id) : true)
                .filter((listing) => byPrice ? ((listing.price >= filter.prices.minPrice) && (listing.price <= filter.prices.maxPrice)) : true)
                .filter((listing) => byArea ? ((listing.area >= filter.areas.minArea) && (listing.area <= filter.areas.maxArea)) : true)
                .filter((listing) => byBedrooms ? (listing.bedrooms == filter.bedrooms) : true);

    };

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
