import React, {useState, useEffect} from "react";
import "./Listing.css"
import Button from "./UI elements/Button/button";
import Card from "./UI elements/Card/card";

function Listing({current, back, showFunction}) { 
    // Create an empty object
    const [currentObject, setCurrentObject] = useState({});
    const [objectCity, setObjectCity] = useState({});
    const [objectRegion, setObjectRegion] = useState({});
    const [objectUser, setObjectUser] = useState({});
    const [otherListings, setOtherListings] = useState([{}]);
    const [othersByfour, setOthersByFour] = useState([]);
    const [othersPage, setOthersPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    // Get the data of the current id post
    const getCurrentListing = async () => {
        const res = await fetch(`https://api.real-estate-manager.redberryinternship.ge/api/real-estates/${current}`, {
            headers: {
              'Authorization': 'Bearer 9d07c60a-2a96-4377-a1a4-5b313b5d9773'
            }
          });

        const listing = await res.json();
        
        setCurrentObject(await listing);
        setObjectCity(await listing.city);
        setObjectRegion(await listing.city.region);
        setObjectUser(await listing.agent);

        const others = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/real-estates', {
            headers: {
              'Authorization': 'Bearer 9d07c60a-2a96-4377-a1a4-5b313b5d9773'
            }
          });

        const resJson = await others.json()
        const filteredArr = await resJson.filter((l) => (l.city.region.id === listing.city.region.id && l.id !== current))
    
        setOtherListings(await filteredArr);

        // translate to 2d array so it can be 4 by 4 arrays
        const otherListingsByFour = spliceByFours(await filteredArr);
        setPageCount(otherListingsByFour.length);
        setOthersByFour(otherListingsByFour);
        console.log(othersPage);
    }

    // UseEffect to run this at the start
    useEffect(() => {
        getCurrentListing();
    }, []);

    // Helper functions
    const timeToDate = (timestamp) => {
        // Create a Date object from the timestamp
        const date = new Date(timestamp);

        // Extract the day, month, and year
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed
        const year = String(date.getFullYear()).slice(2);  // Get the last two digits of the year

        // Format the date as 'DD/MM/YY'
        const formattedDate = `${day}/${month}/${year}`;

        // Return the new format
        return formattedDate;

    }

    // Seperate price with commas
    const priceToString = (p) => {
        if (p === undefined || p === null) {
            return null;
        }

        return p.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ");
    }

    // Show a new listing
    function changeCurrent(id) {
        current = id;
        getCurrentListing();
    }

    // Delete this listing
    const deleteListing = async () => {
        const res = await fetch(`https://api.real-estate-manager.redberryinternship.ge/api/real-estates/${current}`, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer 9d07c60a-2a96-4377-a1a4-5b313b5d9773'
            }
          });

        if (res.status === 200) {
            window.alert("ლისტინგი წაიშალა");
            back();
        } else {
            window.alert("ლისტინგი ვერ წაიშალა, გთხოვთ, სცადოთ თავიდან...");
        }
    }

    const toggleAreYouSure = () => {
        const toToggle = document.getElementById("confirm-delete");
        toToggle.classList.toggle("hidden");
    }

    const spliceByFours = (arr) => {
        const newArr = [];
        while (arr.length) newArr.push(arr.splice(0, 4));
        return newArr;
    }

    const AreYouSure = () => {
        return <div className="confirm-out hidden" id="confirm-delete" onClick={toggleAreYouSure}>
            <div className="confirm-inside" onClick={toggleAreYouSure}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={toggleAreYouSure}>
                    <path d="M6.50115 6.49995L12.0401 12.0389M0.962158 12.0389L6.50115 6.49995L0.962158 12.0389ZM12.0401 0.960938L6.50115 6.49995L12.0401 0.960938ZM6.50115 6.49995L0.962158 0.960938L6.50115 6.49995Z" stroke="#2D3648" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p>გსურთ წაშალოთ ლისტინგი?</p>
                <div className="btn-group">
                    <Button str="გაუქმება" plus={false} primary={false} whenClicked={toggleAreYouSure}/>
                    <Button str="დადასტურება" plus={false} whenClicked={deleteListing}/>
                </div>
            </div>

        </div>
    }

    // Return the page
    return <div className="listing-page">
        {/* The return arrow */}
        <div className="return-button">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => back()}>
                <path d="M11.9428 21.2765C11.4221 21.7972 10.5779 21.7972 10.0572 21.2765L0.723848 11.9431C0.20315 11.4224 0.20315 10.5782 0.723848 10.0575L10.0572 0.724184C10.5779 0.203485 11.4221 0.203485 11.9428 0.724184C12.4635 1.24488 12.4635 2.0891 11.9428 2.6098L4.88561 9.66699H20.3333C21.0697 9.66699 21.6667 10.2639 21.6667 11.0003C21.6667 11.7367 21.0697 12.3337 20.3333 12.3337H4.88561L11.9428 19.3909C12.4635 19.9115 12.4635 20.7558 11.9428 21.2765Z" fill="#021526"/>
            </svg>
        </div>

        <div className="listing">
            {/* The image half */}
            <div className="img-and-date">
                <div className="img-and-sale">
                    <p>{currentObject.is_rental ? "ქირავდება" : "იყიდება"}</p>
                    <img src={currentObject.image}/>
                </div>
                <p>
                    გამოქვეყნების თარიღი {timeToDate(currentObject.created_at)}
                </p>
            </div>

            {/* The actual information */}
            <div className="listing-info">

                {/* The price with commas */}
                <h1>{priceToString(currentObject.price)} ₾</h1>

                {/* The SVG and small data */}
                <div className="lesser-information">
                    <p>
                        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.55527 2.95547C5.5623 -0.0515637 10.4377 -0.0515643 13.4447 2.95547C16.4517 5.96251 16.4517 10.8379 13.4447 13.8449L7.99999 19.2896L2.55527 13.8449C-0.451772 10.8379 -0.451772 5.96251 2.55527 2.95547ZM7.99999 10.6002C9.21501 10.6002 10.2 9.61522 10.2 8.4002C10.2 7.18517 9.21501 6.2002 7.99999 6.2002C6.78496 6.2002 5.79999 7.18517 5.79999 8.4002C5.79999 9.61522 6.78496 10.6002 7.99999 10.6002Z" fill="#808A93"/>
                        </svg>
                        {objectCity.name}, {currentObject.address}
                    </p>
                    <p>
                        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 15.6111C0 16.1121 0.199007 16.5925 0.553243 16.9468C0.907478 17.301 1.38792 17.5 1.88889 17.5H15.1111C15.6121 17.5 16.0925 17.301 16.4468 16.9468C16.801 16.5925 17 16.1121 17 15.6111V2.38889C17 1.88792 16.801 1.40748 16.4468 1.05324C16.0925 0.699007 15.6121 0.5 15.1111 0.5H1.88889C1.38792 0.5 0.907478 0.699007 0.553243 1.05324C0.199007 1.40748 0 1.88792 0 2.38889V15.6111ZM8.5 3.33333H14.1667V9H12.2778V5.22222H8.5V3.33333ZM2.83333 9H4.72222V12.7778H8.5V14.6667H2.83333V9Z" fill="#808A93"/>
                        </svg>

                        ფართი {currentObject.area}<p>მ<sup>2</sup></p>
                    </p>
                    <p>
                        <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.5625 10.4129C18.1291 10.2226 17.6608 10.1246 17.1875 10.125H4.8125C4.3392 10.1245 3.87097 10.2224 3.4375 10.4125C2.82485 10.6804 2.30353 11.121 1.93724 11.6804C1.57096 12.2398 1.37559 12.8938 1.375 13.5625V18.375C1.375 18.5573 1.44743 18.7322 1.57636 18.8611C1.7053 18.9901 1.88016 19.0625 2.0625 19.0625C2.24484 19.0625 2.4197 18.9901 2.54864 18.8611C2.67757 18.7322 2.75 18.5573 2.75 18.375V18.0313C2.75111 17.9404 2.78769 17.8536 2.85191 17.7894C2.91614 17.7252 3.00293 17.6886 3.09375 17.6875H18.9062C18.9971 17.6886 19.0839 17.7252 19.1481 17.7894C19.2123 17.8536 19.2489 17.9404 19.25 18.0313V18.375C19.25 18.5573 19.3224 18.7322 19.4514 18.8611C19.5803 18.9901 19.7552 19.0625 19.9375 19.0625C20.1198 19.0625 20.2947 18.9901 20.4236 18.8611C20.5526 18.7322 20.625 18.5573 20.625 18.375V13.5625C20.6243 12.8939 20.4289 12.24 20.0626 11.6806C19.6964 11.1213 19.1751 10.6808 18.5625 10.4129Z" fill="#808A93"/>
                            <path d="M16.1562 3.9375H5.84375C5.20557 3.9375 4.59353 4.19102 4.14227 4.64227C3.69102 5.09353 3.4375 5.70557 3.4375 6.34375V9.4375C3.43752 9.46413 3.44373 9.4904 3.45564 9.51422C3.46755 9.53805 3.48483 9.55878 3.50612 9.57478C3.52741 9.59078 3.55213 9.60161 3.57833 9.60642C3.60453 9.61123 3.63148 9.60989 3.65707 9.6025C4.03238 9.49273 4.42146 9.43717 4.8125 9.4375H4.99426C5.03668 9.43777 5.07771 9.42234 5.10944 9.39418C5.14117 9.36602 5.16136 9.32712 5.16613 9.28496C5.20363 8.94903 5.36356 8.63868 5.61537 8.41318C5.86718 8.18768 6.19323 8.06284 6.53125 8.0625H8.9375C9.27574 8.06253 9.60211 8.18722 9.85419 8.41275C10.1063 8.63828 10.2664 8.94881 10.3039 9.28496C10.3087 9.32712 10.3289 9.36602 10.3606 9.39418C10.3923 9.42234 10.4334 9.43777 10.4758 9.4375H11.5268C11.5692 9.43777 11.6102 9.42234 11.642 9.39418C11.6737 9.36602 11.6939 9.32712 11.6987 9.28496C11.7361 8.94925 11.8959 8.63908 12.1474 8.41361C12.399 8.18814 12.7247 8.06316 13.0625 8.0625H15.4688C15.807 8.06253 16.1334 8.18722 16.3854 8.41275C16.6375 8.63828 16.7976 8.94881 16.8352 9.28496C16.8399 9.32712 16.8601 9.36602 16.8919 9.39418C16.9236 9.42234 16.9646 9.43777 17.007 9.4375H17.1875C17.5786 9.43731 17.9676 9.49302 18.3429 9.60293C18.3686 9.61033 18.3955 9.61167 18.4218 9.60683C18.448 9.602 18.4727 9.59113 18.4941 9.57508C18.5154 9.55903 18.5326 9.53824 18.5445 9.51436C18.5564 9.49049 18.5625 9.46417 18.5625 9.4375V6.34375C18.5625 5.70557 18.309 5.09353 17.8577 4.64227C17.4065 4.19102 16.7944 3.9375 16.1562 3.9375Z" fill="#808A93"/>
                        </svg>

                        საძინებელი {currentObject.bedrooms}
                    </p>
                    <p>
                        <svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.89431 0.394496C7.65904 0.64712 7.52683 0.989776 7.52676 1.34709V4.83142H1.25446C0.921756 4.83142 0.602679 4.97338 0.367423 5.22606C0.132166 5.47874 0 5.82146 0 6.1788V11.5683C0 11.9257 0.132166 12.2684 0.367423 12.5211C0.602679 12.7738 0.921756 12.9157 1.25446 12.9157H7.52676V21H10.0357V12.9157H14.4664C14.6503 12.9156 14.8319 12.8722 14.9984 12.7883C15.1649 12.7045 15.3122 12.5824 15.4298 12.4307L17.8547 9.30473C17.9486 9.18368 18 9.03111 18 8.87357C18 8.71602 17.9486 8.56346 17.8547 8.4424L15.4298 5.31648C15.3122 5.16473 15.1649 5.04263 14.9984 4.95881C14.8319 4.87498 14.6503 4.8315 14.4664 4.83142H10.0357V1.34709C10.0356 1.08065 9.96202 0.820203 9.82417 0.59868C9.68633 0.377157 9.49043 0.204504 9.26124 0.102548C9.03205 0.000591374 8.77986 -0.0260908 8.53656 0.0258744C8.29325 0.0778397 8.06975 0.206119 7.89431 0.394496Z" fill="#021526" fill-opacity="0.5"/>
                        </svg>

                        საფოსტო ინდექსი {currentObject.zip_code}
                    </p>
                </div>
                
                {/* The description of this listing */}
                <div className="listing-desc">
                    {currentObject.description}
                </div>

                {/* The agent */}
                <div className="agent-card">
                    <div className="agent-top">
                        <img src={objectUser.avatar}/>
                        <div className="agent-name">
                            <h4>{objectUser.name} {objectUser.surname}</h4>
                            <p>აგენტი</p>
                        </div>
                    </div>
                    <div className="agent-bottom">
                        <p>
                        <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.84341e-05 2.15414C-1.95112e-05 2.16127 -3.14003e-05 2.16839 6.24258e-05 2.17551V10.8333C6.24258e-05 12.0266 0.980211 13 2.18186 13H13.8181C15.0198 13 15.9999 12.0266 15.9999 10.8333V2.1756C16 2.16841 16 2.16122 15.9999 2.15404C15.993 0.966489 15.0155 0 13.8181 0H2.18186C0.984418 0 0.00692812 0.966547 9.84341e-05 2.15414ZM1.53211 1.84452C1.65238 1.60833 1.89971 1.44444 2.18186 1.44444H13.8181C14.1003 1.44444 14.3476 1.60833 14.4679 1.84452L8 6.34064L1.53211 1.84452ZM14.5454 3.55381V10.8333C14.5454 11.2289 14.2165 11.5556 13.8181 11.5556H2.18186C1.78353 11.5556 1.4546 11.2289 1.4546 10.8333V3.55381L7.58294 7.81389C7.83335 7.98796 8.16665 7.98796 8.41706 7.81389L14.5454 3.55381Z" fill="#808A93"/>
                        </svg>
                        {objectUser.email}
                        </p>
                        <p>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.08632 3.45996C9.69678 3.57906 10.2578 3.87762 10.6976 4.31742C11.1374 4.75722 11.436 5.31825 11.5551 5.92871M9.08632 0.959961C10.3546 1.10086 11.5373 1.66882 12.4402 2.57059C13.3431 3.47236 13.9126 4.65434 14.0551 5.92246M13.4301 10.91V12.785C13.4308 12.959 13.3951 13.1313 13.3254 13.2908C13.2557 13.4503 13.1534 13.5935 13.0251 13.7111C12.8969 13.8288 12.7454 13.9184 12.5805 13.9742C12.4157 14.0299 12.2409 14.0506 12.0676 14.035C10.1443 13.826 8.29695 13.1688 6.67382 12.1162C5.16372 11.1566 3.88341 9.87632 2.92382 8.36621C1.86756 6.73571 1.21022 4.87933 1.00507 2.94746C0.989455 2.77463 1.00999 2.60044 1.06539 2.43598C1.12078 2.27152 1.2098 2.12039 1.3268 1.99222C1.4438 1.86406 1.5862 1.76165 1.74494 1.69154C1.90368 1.62142 2.07529 1.58512 2.24882 1.58496H4.12382C4.42714 1.58198 4.72119 1.68939 4.95117 1.88717C5.18116 2.08495 5.33137 2.35962 5.37382 2.65996C5.45296 3.26 5.59973 3.84917 5.81132 4.41621C5.89541 4.63991 5.91361 4.88303 5.86376 5.11676C5.81392 5.35049 5.69811 5.56503 5.53007 5.73496L4.73632 6.52871C5.62605 8.09343 6.92161 9.38899 8.48632 10.2787L9.28007 9.48496C9.45 9.31692 9.66454 9.20112 9.89827 9.15127C10.132 9.10142 10.3751 9.11962 10.5988 9.20371C11.1659 9.41531 11.755 9.56207 12.3551 9.64121C12.6587 9.68404 12.9359 9.83697 13.1342 10.0709C13.3324 10.3048 13.4377 10.6034 13.4301 10.91Z" stroke="#808A93" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {objectUser.phone}
                        </p>
                    </div>
                </div>

                <Button str="ლისტინგის წაშლა" gray={true} plus={false} whenClicked={toggleAreYouSure}/>
            </div>
        </div>

        <h1>ბინები მსგავს ლოკაციაზე</h1>
        <div className="listing-scroll">
            {/* Go left, if there are others */}
            {
                pageCount <= 1 ?

                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="left" className="svg-blocked">
                    <path d="M10.8839 19.6339C10.3957 20.122 9.60427 20.122 9.11612 19.6339L0.366117 10.8839C-0.12204 10.3957 -0.12204 9.60427 0.366117 9.11612L9.11612 0.366117C9.60427 -0.12204 10.3957 -0.12204 10.8839 0.366117C11.372 0.854271 11.372 1.64573 10.8839 2.13388L4.26777 8.75L18.75 8.75C19.4404 8.75 20 9.30964 20 10C20 10.6904 19.4404 11.25 18.75 11.25L4.26777 11.25L10.8839 17.8661C11.372 18.3543 11.372 19.1457 10.8839 19.6339Z" fill="#021526"/>
                </svg>

                : 

                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" id="left" onClick={() => (othersPage > 0 ? setOthersPage(othersPage-1) : setOthersPage(pageCount-1))}>
                    <path d="M10.8839 19.6339C10.3957 20.122 9.60427 20.122 9.11612 19.6339L0.366117 10.8839C-0.12204 10.3957 -0.12204 9.60427 0.366117 9.11612L9.11612 0.366117C9.60427 -0.12204 10.3957 -0.12204 10.8839 0.366117C11.372 0.854271 11.372 1.64573 10.8839 2.13388L4.26777 8.75L18.75 8.75C19.4404 8.75 20 9.30964 20 10C20 10.6904 19.4404 11.25 18.75 11.25L4.26777 11.25L10.8839 17.8661C11.372 18.3543 11.372 19.1457 10.8839 19.6339Z" fill="#021526"/>
                </svg>
            }
            
            <div className="all-cards">
                { 
                    othersByfour.length == 0 ? <p>მსგავსი განცხადება ვერ მოიძებნა</p> :
                    othersByfour[othersPage].map((l) => {
                        return <Card data={l} show={changeCurrent}/>
                    })
                }
            </div>

            {/* Go to right, if there are others */}
            {
                pageCount <= 1 ?

                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-blocked">
                    <path d="M9.11612 0.366117C9.60427 -0.122039 10.3957 -0.122039 10.8839 0.366117L19.6339 9.11612C20.122 9.60427 20.122 10.3957 19.6339 10.8839L10.8839 19.6339C10.3957 20.122 9.60427 20.122 9.11612 19.6339C8.62796 19.1457 8.62796 18.3543 9.11612 17.8661L15.7322 11.25H1.25C0.559644 11.25 0 10.6904 0 10C0 9.30964 0.559644 8.75 1.25 8.75H15.7322L9.11612 2.13388C8.62796 1.64573 8.62796 0.854272 9.11612 0.366117Z" fill="#021526"/>
                </svg>

                :

                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => (othersPage < pageCount-1 ? setOthersPage(othersPage+1) : setOthersPage(0))}>
                    <path d="M9.11612 0.366117C9.60427 -0.122039 10.3957 -0.122039 10.8839 0.366117L19.6339 9.11612C20.122 9.60427 20.122 10.3957 19.6339 10.8839L10.8839 19.6339C10.3957 20.122 9.60427 20.122 9.11612 19.6339C8.62796 19.1457 8.62796 18.3543 9.11612 17.8661L15.7322 11.25H1.25C0.559644 11.25 0 10.6904 0 10C0 9.30964 0.559644 8.75 1.25 8.75H15.7322L9.11612 2.13388C8.62796 1.64573 8.62796 0.854272 9.11612 0.366117Z" fill="#021526"/>
                </svg>
            }
            
        </div>

        <AreYouSure />
    </div>
}

export default Listing;