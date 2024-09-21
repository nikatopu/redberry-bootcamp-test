import React, {useState} from 'react';

function ByArea({ filter, setFilter }) {
    // Create a new filter to update
    // This ensures that the filter isn't tossed around
    const [newFilter, setNewFilter] = useState(filter); 


    // Comparing Units
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

    // Updating areas
    const updateMinArea = (num) => {
        setNewFilter((prevFilter) => {
            return {
                ...prevFilter,
                areas: {
                    minArea: num === null ? 0 : num,
                    maxArea: prevFilter.areas.maxArea,
                },
                by_area: compareUnits(num, prevFilter.areas.maxArea),
            };
        });
    }

    const updateMaxArea = (num) => {
        setNewFilter((prevFilter) => {
            return {
                ...prevFilter,
                areas: {
                    minArea: prevFilter.areas.minArea,
                    maxArea: num === null ? 0 : num,
                },
                by_area: compareUnits(prevFilter.areas.minArea, num),
            };
        });
    }

    // Easy select
    const easySelectMin = [10, 15, 30, 50, 100];
    const easySelectMax = easySelectMin;

    return (
        <div className="filter-div">
            <div className="filter-box">
                <h3>ფართობის მიხედვით</h3>
                <div className="prices">
                    <div className="price-column">
                        <label>
                            <input 
                                placeholder="დან" 
                                value={newFilter.areas.minArea !== 0 ? newFilter.areas.minArea : ''} 
                                onChange={(e) => updateMinArea(e.target.value)} 
                            />
                        </label>
                        <h4>მინ. მ<sup>2</sup></h4>
                        {
                            easySelectMin.map((opt) => {
                                return <p onClick={() => updateMinArea(opt)}>{opt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} მ²</p>
                            })
                        }
                    </div>
                    <div className="price-column">
                        <label>
                            <input 
                                placeholder="მდე" 
                                value={newFilter.areas.maxArea !== 0 ? newFilter.areas.maxArea : ''} 
                                onChange={(e) => updateMaxArea(e.target.value)} 
                            />
                        </label>
                        <h4>მაქს. მ<sup>2</sup></h4>
                        {
                            easySelectMax.map((opt) => {
                                return <p onClick={() => updateMaxArea(opt)}>{opt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} მ²</p>
                            })
                        }
                    </div>
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

export default ByArea;
