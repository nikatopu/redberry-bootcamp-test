import React, {useState} from 'react';

function ByBedrooms({ filter, setFilter }) {
    // Create a new filter to update
    // This ensures that the filter isn't tossed around
    const [newFilter, setNewFilter] = useState(filter); 

    // Update the bedrooms
    const updateBedrooms = (num) => {
        setNewFilter((prevFilter) => {
            return {
                ...prevFilter,
                bedrooms: num,
                by_bedrooms: num > 0,
            };
        });
    }

    return (
        <div className="filter-div">
            <div className="filter-box" id="bedrooms">
                <h3>საძინებლების რაოდენობა</h3>
                <input 
                    type="number" 
                    value={newFilter.bedrooms} 
                    onChange={(e) => updateBedrooms(e.target.value)} 
                />
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

export default ByBedrooms;
