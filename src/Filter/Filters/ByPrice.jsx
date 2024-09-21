import React, {useState} from 'react';

function ByPrice({ filter, setFilter }) {
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


    // Updating prices
    const updateMinPrice = (num) => {
        setNewFilter((prevFilter) => {
            return {
                ...prevFilter,
                prices: {
                    minPrice: num === null ? 0 : num,
                    maxPrice: prevFilter.prices.maxPrice,
                },
                by_price: compareUnits(num, prevFilter.prices.maxPrice),
            };
        });
    }

    const updateMaxPrice = (num) => {
        setNewFilter((prevFilter) => {
            return {
                ...prevFilter,
                prices: {
                    minPrice: prevFilter.prices.minPrice,
                    maxPrice: num === null ? 0 : num,
                },
                by_price: compareUnits(prevFilter.prices.minPrice, num),
            };
        });
    }

    // Easy select
    const easySelectMin = [50000, 100000, 150000, 200000, 300000];
    const easySelectMax = easySelectMin;

    return (
        <div className="filter-div">
            <div className="filter-box">
                <h3>ფასის მიხედვით</h3>
                <div className="prices">
                    <div className="price-column">
                        <label>
                            <input 
                                placeholder="დან" 
                                value={newFilter.prices.minPrice !== 0 ? newFilter.prices.minPrice : ''} 
                                onChange={(e) => updateMinPrice(e.target.value)} 
                            />
                            <p>₾</p>
                        </label>
                        <h4>მინ. ფასი</h4>
                        {
                            easySelectMin.map((opt) => {
                                return <p onClick={() => updateMinPrice(opt)}>{opt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ₾</p>
                            })
                        }
                    </div>
                    <div className="price-column">
                        <label>
                            <input 
                                placeholder="მდე" 
                                value={newFilter.prices.maxPrice !== 0 ? newFilter.prices.maxPrice : ''} 
                                onChange={(e) => updateMaxPrice(e.target.value)} 
                            />
                            <p>₾</p>
                        </label>
                        <h4>მაქს. ფასი</h4>
                        {
                            easySelectMax.map((opt) => {
                                return <p onClick={() => updateMaxPrice(opt)}>{opt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ₾</p>
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

export default ByPrice;
