import React, { useEffect, useState } from 'react';

function ByRegion({ filter, setFilter }) {
    // Get the regions
    const [regionsArr, setRegionsArr] = useState([]);
    const fetchRegions = async (event) => {
        try {
            const res = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/regions');
            setRegionsArr(await res.json());
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {fetchRegions()}, [])

    // Create a new filter to update
    // This ensures that the filter isn't tossed around
    const [newFilter, setNewFilter] = useState(filter); 

    // Handle region update for the filter
    const regionUpdate = (num) => {
        setNewFilter((prevFilter) => {
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
                                checked={newFilter.regions.includes(el.id)}
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
                        <button className="btn-primary" onClick={() => setFilter(newFilter)}>არჩევა</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ByRegion;
