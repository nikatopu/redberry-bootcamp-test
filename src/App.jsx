import React, { useState, useEffect, useMemo } from "react";
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

    // Fetch the listings after any change is made to the booleans of the filter
    useEffect(() => {
        fetchListings();
    }, [filter.by_area, filter.by_bedrooms, filter.by_price, filter.by_region]);

    // Filter listings by region
    const filterListings = (arr) => {
        const byRegion = filter.regions.length > 0;
        const byPrice = comparePrices(filter.prices.minPrice, filter.prices.maxPrice);
        const byArea = compareAreas(filter.areas.minArea, filter.areas.maxArea);
        const byBedrooms = filter.bedrooms > 0;
        return arr.filter((listing) => byRegion ? filter.regions.includes(listing.city.region_id) : true)
                .filter((listing) => byPrice ? ((listing.price >= filter.prices.minPrice) && (listing.price <= filter.prices.maxPrice)) : true)
                .filter((listing) => byArea ? ((listing.area >= filter.areas.minArea) && (listing.area <= filter.areas.maxArea)) : true)
                .filter((listing) => byBedrooms ? (listing.bedrooms == filter.bedrooms) : true);

    };

    // Handle region update for the filter
    const regionUpdate = (num) => {
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

    // Updating prices
    const comparePrices = (min_p, max_p) => {
        return ((min_p != null && max_p != null) && ((min_p !== 0 && max_p >= min_p) || (max_p > min_p)));
    }

    const updateMinPrice = (num) => {
        setFilter((prevFilter) => {
            return {
                ...prevFilter,
                prices: {
                    minPrice: num === null ? 0 : num,
                    maxPrice: prevFilter.prices.maxPrice,
                },
                by_price: comparePrices(num , prevFilter.prices.maxPrice),
            };
        });
    }

    const updateMaxPrice = (num) => {
        setFilter((prevFilter) => {
            return {
                ...prevFilter,
                prices: {
                    minPrice: prevFilter.prices.minPrice,
                    maxPrice: num === null ? 0 : num,
                },
                by_price: comparePrices(prevFilter.prices.minPrice, num),
            };
        });
    }

    const resetPrices = () => {
        setFilter((prevFilter) => {
            return {
                ...prevFilter,
                prices: {
                    minPrice: 0,
                    maxPrice: 0,
                },
                by_price: false,
            };
        });
    }

    // Updating areas
    const compareAreas = (min_a, max_a) => {
        return ((min_a != null && max_a != null) && ((min_a !== 0 && max_a >= min_a) || (max_a > min_a)));
    }

    const updateMinArea = (num) => {
        setFilter((prevFilter) => {
            return {
                ...prevFilter,
                areas: {
                    minArea: num === null ? 0 : num,
                    maxArea: prevFilter.areas.maxArea,
                },
                by_area: compareAreas(num, prevFilter.areas.maxArea),
            };
        });
    }

    const updateMaxArea = (num) => {
        setFilter((prevFilter) => {
            return {
                ...prevFilter,
                areas: {
                    minArea: prevFilter.areas.minArea,
                    maxArea: num === null ? 0 : num,
                },
                by_area: compareAreas(prevFilter.areas.minArea, num),
            };
        });
    }

    const resetAreas = () => {
        setFilter((prevFilter) => {
            return {
                ...prevFilter,
                areas: {
                    minArea: 0,
                    maxArea: 0,
                },
                by_area: false,
            };
        });
    }

    // The bedrooms
    const updateBedrooms = (num) => {
        setFilter((prevFilter) => {
            return {
                ...prevFilter,
                bedrooms: num,
                by_bedrooms: num > 0,
            };
        });
    }

    // Filter by region UI component
    function ByRegion() {
        return (
            <div className="filter-div">
                <div className="filter-box">
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

    // Filter by price UI component
    function ByPrice() {
        return <div className="filter-div">
            <div className="filter-box">
                <h3>ფასის მიხედვით</h3>
                <div className="prices">
                    <div className="price-column">
                        <label>
                            <input placeholder="დან" value={filter.prices.minPrice !== 0 ? filter.prices.minPrice : null} onChange={(e) => updateMinPrice(e.target.value)}></input>
                        </label>

                        <h4>მინ. ფასი</h4>
                        <p onClick={() => updateMinPrice(50000)}>50, 000</p>
                        <p onClick={() => updateMinPrice(100000)}>100, 000</p>
                        <p onClick={() => updateMinPrice(150000)}>150, 000</p>
                        <p onClick={() => updateMinPrice(200000)}>200, 000</p>
                        <p onClick={() => updateMinPrice(300000)}>300, 000</p>

                    </div>
                    <div className="price-column">
                        <label>
                            <input placeholder="დან" value={filter.prices.maxPrice !== 0 ? filter.prices.maxPrice : null} onChange={(e) => updateMaxPrice(e.target.value)}></input>
                        </label>

                        <h4>მაქს. ფასი</h4>
                        <p onClick={() => updateMaxPrice(50000)}>50, 000</p>
                        <p onClick={() => updateMaxPrice(100000)}>100, 000</p>
                        <p onClick={() => updateMaxPrice(150000)}>150, 000</p>
                        <p onClick={() => updateMaxPrice(200000)}>200, 000</p>
                        <p onClick={() => updateMaxPrice(300000)}>300, 000</p>
                    </div>
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
    }

    function ByArea() {
        return <div className="filter-div">
            <div className="filter-box">
                <h3>ფართობის მიხედვით</h3>
                <div className="prices">
                    <div className="price-column">
                        <label>
                            <input placeholder="დან" value={filter.areas.minArea !== 0 ? filter.areas.minArea : null} onChange={(e) => updateMinArea(e.target.value)}></input>
                        </label>

                        <h4>მინ. მ<sup>2</sup></h4>
                        <p onClick={() => updateMinArea(50000)}>50, 000</p>
                        <p onClick={() => updateMinArea(100000)}>100, 000</p>
                        <p onClick={() => updateMinArea(150000)}>150, 000</p>
                        <p onClick={() => updateMinArea(200000)}>200, 000</p>
                        <p onClick={() => updateMinArea(300000)}>300, 000</p>

                    </div>
                    <div className="price-column">
                        <label>
                            <input placeholder="დან" value={filter.areas.maxArea !== 0 ? filter.areas.maxArea : null} onChange={(e) => updateMaxArea(e.target.value)}></input>
                        </label>

                        <h4>მაქს. მ<sup>2</sup></h4>
                        <p onClick={() => updateMaxArea(50000)}>50, 000</p>
                        <p onClick={() => updateMaxArea(100000)}>100, 000</p>
                        <p onClick={() => updateMaxArea(150000)}>150, 000</p>
                        <p onClick={() => updateMaxArea(200000)}>200, 000</p>
                        <p onClick={() => updateMaxArea(300000)}>300, 000</p>
                    </div>
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
    }

    function ByBedrooms() {
        return <div className="filter-div">
            <div className="filter-box" id="bedrooms">
                <h3>საძინებლების რაოდენობა</h3>
                <input type="number" value={filter.bedrooms} onChange={(ev) => ev.target.value != null ? updateBedrooms(ev.target.value) : updateBedrooms(0)}/>
            </div>
            <div>
                <div className="move-right">
                    <div className="btn-group">
                        <button className="btn-primary" onClick={() => fetchListings()}>არჩევა</button>
                    </div>
                </div>
            </div>
        </div>
    }

    const clearFilters = () => {
        setFilter({
            by_region: false,
            regions: [],
            by_price: false,
            prices: { minPrice: 0, maxPrice: 0 },
            by_area: false,
            areas: { minArea: 0, maxArea: 0 },
            by_bedrooms: false,
            bedrooms: 0,
        })
    }

    // Display all of the active filters
    function ActiveFilters() {
        // A single active filter component
        function ActiveFilter({ label, onClear }) {
            return (
                <div className="active-filter" onClick={onClear}>
                    {label}
                    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 4L3.5 11" stroke="#354451" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3.5 4L10.5 11" stroke="#354451" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            );
        }
    
        // Memoize active filters to prevent unnecessary recalculations
        const activeFilters = useMemo(() => {
            const filters = [];
    
            // Add region filters
            if (filter.by_region) {
                filter.regions.forEach((regionId) => {
                    const regionName = regionsArr.find((obj) => obj.id === regionId)?.name;
                    filters.push({
                        label: regionName,
                        onClear: () => regionUpdate(regionId),
                    });
                });
            }
    
            // Add price filter
            if (filter.by_price) {
                filters.push({
                    label: `${filter.prices.minPrice}₾ - ${filter.prices.maxPrice}₾`,
                    onClear: resetPrices,
                });
            }
    
            // Add area filter
            if (filter.by_area) {
                filters.push({
                    label: `${filter.areas.minArea}მ² - ${filter.areas.maxArea}მ²`,
                    onClear: resetAreas,
                });
            }
    
            // Add bedroom filter
            if (filter.by_bedrooms) {
                filters.push({
                    label: `${filter.bedrooms} საძინებელი`,
                    onClear: () => updateBedrooms(0),
                });
            }
    
            return filters;
        }, [filter, regionsArr]);
    
        // Update when the filter changes
        useEffect(() => {}, [filter]);

        return (
            <div className="all-active-filters">
                {activeFilters.map((filter, index) => (
                    <ActiveFilter key={index} label={filter.label} onClear={filter.onClear} />
                ))}
                {/* Clear all filters button */}
                {activeFilters.length > 0 && <b onClick={clearFilters}> გასუფთავება </b>}
            </div>
        );
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
            <FilterComponent str="საფასო კატეგორია" CustomDiv={ByPrice}/>
            <FilterComponent str="ფართობი" CustomDiv={ByArea}/>
            <FilterComponent str="საძინებლების რაოდენობა" CustomDiv={ByBedrooms}/>
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
