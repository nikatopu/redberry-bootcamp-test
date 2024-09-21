import React, { useMemo } from 'react';

function ActiveFilters({ filter, setFilter, regions}) {
    // The empty filter object to set the filter
    const emptyFilter = {              // The filter object we use to filter through the listing
        by_region: false,
        regions: [],
        by_price: false,
        prices: { minPrice: 0, maxPrice: 0 },
        by_area: false,
        areas: { minArea: 0, maxArea: 0 },
        by_bedrooms: false,
        bedrooms: 0,
    }

    // Reset the region
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

    // Reset the prices
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

    // Reset the areas
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

    // Reset the bedrooms
    const updateBedrooms = () => {
        setFilter((prevFilter) => {
            return {
                ...prevFilter,
                bedrooms: 0,
                by_bedrooms: false,
            };
        });
    }

    // Create a filters array and return it
    const activeFilters = useMemo(() => {
        const filters = [];

        // Add region filters
        if (filter.by_region) {
            filter.regions.forEach((regionId) => {
                filters.push({ label: `${regions.find((obj) => obj.id === regionId)?.name}`, onClear: () => {regionUpdate(regionId)} });
            });
        }

        // Add price filters
        if (filter.by_price) {
            filters.push({ label: `${filter.prices.minPrice}₾ - ${filter.prices.maxPrice}₾`, onClear: () => {resetPrices()} });
        }

        // Add area filters
        if (filter.by_area) {
            filters.push({ label: `${filter.areas.minArea}მ² - ${filter.areas.maxArea}მ²`, onClear: () => {resetAreas()} });
        }

        // Add bedroom filters
        if (filter.by_bedrooms) {
            filters.push({ label: `${filter.bedrooms} საძინებელი`, onClear: () => {updateBedrooms()} });
        }

        return filters;
    }, [filter]);

    // Return the ActiveFilters div
    return (
        <div className="all-active-filters">
            {activeFilters.map((f, idx) => (
                    <div className='active-filter' key={idx} onClick={f.onClear}>
                        {f.label}
                        <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 4L3.5 11" stroke="#354451" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3.5 4L10.5 11" stroke="#354451" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                    </div>
                
            ))}
            {activeFilters.length > 0 && <b onClick={() => setFilter(emptyFilter)}>გასუფთავება</b>}
        </div>
    );
}

export default ActiveFilters;
