import React, {useState, useEffect} from "react";
import "./ListingForm.css";
import "../../UI elements/Button/button.css";

function ListingForm({backTo = () => {}}) {
    // Initialize state with localStorage values if available
    const [address, setAddress] = useState(localStorage.getItem('address') || '');
    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState('');
    const [region_id, setRegionId] = useState(localStorage.getItem('region_id') || '');
    const [description, setDescription] = useState(localStorage.getItem('description') || '');
    const [city_id, setCityId] = useState(localStorage.getItem('city_id') || '');
    const [zip_code, setZipCode] = useState(localStorage.getItem('zip_code') || '');
    const [price, setPrice] = useState(localStorage.getItem('price') || '');
    const [area, setArea] = useState(localStorage.getItem('area') || '');
    const [bedrooms, setBedrooms] = useState(localStorage.getItem('bedrooms') || '');
    const [is_rental, setIsRental] = useState(localStorage.getItem('is_rental') || '0');
    const [agent_id, setAgentId] = useState(localStorage.getItem('agent_id') || '0');

    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [agents, setAgents] = useState([]);

    // Automatically update the city id after the change of region id
    useEffect(() => {
        setCityId(cities.find((city) => city.region_id === region_id)?.id);
    }, [region_id])

    // Update localStorage whenever a state changes
    useEffect(() => {
        localStorage.setItem('address', address);
        localStorage.setItem('region_id', region_id);
        localStorage.setItem('description', description);
        localStorage.setItem('city_id', city_id);
        localStorage.setItem('zip_code', zip_code);
        localStorage.setItem('price', price);
        localStorage.setItem('area', area);
        localStorage.setItem('bedrooms', bedrooms);
        localStorage.setItem('is_rental', is_rental);
        localStorage.setItem('agent_id', agent_id);
    }, [address, region_id, description, city_id, zip_code, price, area, bedrooms, is_rental, agent_id]);

    const getAllAgents = async () => {
        try {
            const ags = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/agents', {
                headers: {
                    'Authorization': 'Bearer 9d07c60a-2a96-4377-a1a4-5b313b5d9773'
                }
            });
            const agentArr = await ags.json();
            setAgents(agentArr);
            if (agentArr.length > 0 && !agent_id) {
                setAgentId(agentArr[0].id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Get the regions, cities, and agents
    useEffect(() => {
        const getAllRegions = async () => {
            try {
                const reg = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/regions');
                setRegions(await reg.json());
            } catch (error) {
                console.log(error);
            }
        };

        const getAllCities = async () => {
            try {
                const cit = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/cities');
                setCities(await cit.json());
            } catch (error) {
                console.log(error);
            }
        };

        getAllRegions();
        getAllCities();
        getAllAgents();
    }, []);

    const updateRegion = (regId) => {
        setRegionId(regId);
        const filteredCities = cities.filter(city => city.region_id == regId);
        setCityId(filteredCities.length ? filteredCities[0].id : '');
    };

    // Image to Base64
    const listingPhotoUploaded = () => {
        const file = document.querySelector('#listing-photo')['files'][0];
        if (!file) return false;

        const validExtensions = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'tiff'];
        const extension = file.name.split('.').pop().toLowerCase();
        if (!validExtensions.includes(extension)) {
            setImage(null);
            setImageBase64('');
            return false;
        }

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > 1) {
            alert("Image is too big, please upload an image less than 1mb in size.");
            setImage(null);
            setImageBase64('');
            return false;
        }

        const reader = new FileReader();
        reader.onload = function () {
            const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
            setImage(file);
            setImageBase64(base64String);
        };
        reader.readAsDataURL(file);
    };

    const fetchHandle = async (e) => {
        e.preventDefault();
        if (!checkRequirements()) return false;

        try {
            const form = new FormData();
            form.append('region_id', region_id);
            form.append('price', price);
            form.append('zip_code', zip_code);
            form.append('area', area);
            form.append('city_id', city_id);
            form.append('address', address);
            form.append('agent_id', agent_id);
            form.append('bedrooms', bedrooms);
            form.append('is_rental', is_rental);
            form.append('image', image);
            form.append('description', description);

            const res = await fetch("https://api.real-estate-manager.redberryinternship.ge/api/real-estates", {
                method: "POST",
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Bearer 9d07c60a-2a96-4377-a1a4-5b313b5d9773',
                },
                body: form,
            });

            if (res.status === 201) {
                alert("ლისტინგი დაემატა წარმატებით!");
                backTo();
                localStorage.clear();  // Clear localStorage after successful submission
            } else {
                alert("ლისტინგის დამატება ვერ მოხერხდა, გთხოვთ სცადოთ თავიდან.");
                console.log(res);
            }
        } catch (err) {
            throw err;
        }
    };

        // The plus svg
        function PlusSvg() {
            return  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 8V16" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 12H16" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
        }
    
        // The image to display
        function ImgUploaded() {
            return <div>
                <img src={"data:image/jpg;base64,"+imageBase64} alt=""/>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setImageBase64('')}>
                    <circle cx="12" cy="12" r="11.5" fill="white" stroke="#021526"/>
                    <path d="M6.75 8.5H7.91667H17.25" stroke="#021526" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16.0834 8.50033V16.667C16.0834 16.9764 15.9605 17.2732 15.7417 17.492C15.5229 17.7107 15.2262 17.8337 14.9167 17.8337H9.08341C8.774 17.8337 8.47725 17.7107 8.25846 17.492C8.03966 17.2732 7.91675 16.9764 7.91675 16.667V8.50033M9.66675 8.50033V7.33366C9.66675 7.02424 9.78966 6.72749 10.0085 6.5087C10.2272 6.28991 10.524 6.16699 10.8334 6.16699H13.1667C13.4762 6.16699 13.7729 6.28991 13.9917 6.5087C14.2105 6.72749 14.3334 7.02424 14.3334 7.33366V8.50033" stroke="#021526" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.8333 11.417V14.917" stroke="#021526" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13.1667 11.417V14.917" stroke="#021526" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        }

    // Checking each field for requierements
    function checkAdress() {
        return (address.length >= 2);
    }

    function checkImage() {
        return (imageBase64.length > 0 && image !== null)
    }

    function checkZipCode() {
        return (/^\d+$/.test(zip_code));
    }

    function checkPrice() {
        return (/^\d+$/.test(price));
    }

    function checkArea() {
        return (/^\d+$/.test(area));
    }

    function checkBedrooms() {
        return (/^\d+$/.test(bedrooms));
    }

    function checkDescription() {
        return (description.replace(/\s+/g, ' ').trim().split(" ").length >= 5);
    }

    const checkRequirements = () => checkAdress() && checkImage() && checkZipCode() && checkPrice() && checkArea() && checkBedrooms() && checkDescription();

    // For the dropdown component
    const [selectedDropdown, setSelectedDropdown] = useState("");
    const updateDropdown = (dp) => {
        selectedDropdown == dp ? setSelectedDropdown("") : setSelectedDropdown(dp);
    }

    // Toggling the agent div
    const toggleAgent = () => {
        const agentForm = document.getElementById("agent-form");
        agentForm.classList.toggle("hidden");
    };

    return (
        <div className="listing-form" id="listing-form">
            <h1>ლისტინგის დამატება</h1>
            
            <form onSubmit={fetchHandle}>
                <div className="listing-form-part">
                    <h2>გარიგების ტიპი</h2>
                    <div className="flex-row" required>
                        <input type="radio" id="იყიდება" name="გარიგება" className="radio" value={0} onClick={(e) => setIsRental(e.target.value)} checked={is_rental == 0}></input>
                        <label>
                            იყიდება
                        </label>
                        
                        
                        <input type="radio" id="ქირავდება" name="გარიგება" className="radio"  value={1} onClick={(e) => setIsRental(e.target.value)} checked={is_rental == 1}></input>
                        <label>
                            ქირავდება
                        </label>
                    </div> 
                </div>

                <div className="listing-form-part">
                    <h2>მდებარეობა</h2>
                    <label className={address.length === 0 ? "" : (checkAdress() ? "correct" : "incorrect")}>
                        მისამართი *
                        <input type="text" name="name" onChange={(e) => setAddress(e.target.value)} value={address} required/>
                        <p>
                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 1.4082L4.125 9.59002L1 5.87101" stroke="#021526" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            &nbsp;
                            მინიმუმ ორი სიმბოლო
                        </p>
                    </label>
                    <label className={zip_code.length === 0 ? "" : (checkZipCode() ? "correct" : "incorrect")}>
                        საფოსტო ინდექსი *
                        <input type="text" name="name" onChange={(e) => setZipCode(e.target.value)} value={zip_code} required/>
                        <p>
                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 1.4082L4.125 9.59002L1 5.87101" stroke="#021526" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            &nbsp;
                            მხოლოდ რიცხვები
                        </p>
                    </label>
                    <label className="of-custom-dropdown">
                        რეგიონი
                        <div className="custom-dropdown">
                            <div className={selectedDropdown === "regions" ? "dp dp-top" : "dp dp-top"} onClick={() => updateDropdown("regions")}>
                                {
                                    <p>{regions.find((region) => region.id == region_id)?.name}</p>
                                }

                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={selectedDropdown === "regions" ? "svg-rotated" : ""}>
                                    <path d="M3.91232 4.83785C3.68451 4.61004 3.31516 4.61004 3.08736 4.83785C2.85955 5.06565 2.85955 5.435 3.08736 5.6628L6.58736 9.1628C6.81516 9.39061 7.18451 9.39061 7.41232 9.1628L10.9123 5.6628C11.1401 5.435 11.1401 5.06565 10.9123 4.83785C10.6845 4.61004 10.3152 4.61004 10.0874 4.83785L6.99984 7.92537L3.91232 4.83785Z" fill="#021526"/>
                                </svg>

                            </div>
                            {
                                selectedDropdown === "regions" ? regions.map((region) => {
                                        return <div className="dp dp-middle" onClick={async () => {setRegionId(region.id); updateDropdown("");}}>
                                            <p>{region.name}</p>
                                        </div>
                                }) : null
                            }
                        </div>
                    </label>
                    <label className="of-custom-dropdown">
                        ქალაქი
                        <div className="custom-dropdown">
                            <div className={selectedDropdown === "cities" ? "dp dp-top" : "dp dp-top"} onClick={() => updateDropdown("cities")}>
                                {
                                    <p>{cities.find((city) => city.id == city_id)?.name}</p>
                                }

                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={selectedDropdown === "cities" ? "svg-rotated" : ""}>
                                    <path d="M3.91232 4.83785C3.68451 4.61004 3.31516 4.61004 3.08736 4.83785C2.85955 5.06565 2.85955 5.435 3.08736 5.6628L6.58736 9.1628C6.81516 9.39061 7.18451 9.39061 7.41232 9.1628L10.9123 5.6628C11.1401 5.435 11.1401 5.06565 10.9123 4.83785C10.6845 4.61004 10.3152 4.61004 10.0874 4.83785L6.99984 7.92537L3.91232 4.83785Z" fill="#021526"/>
                                </svg>

                            </div>
                            {
                                selectedDropdown === "cities" ? cities.filter((city) => city.region_id === region_id).map((city) => {
                                        return <div className="dp dp-middle" onClick={() => {setCityId(city.id); updateDropdown("");}}>
                                            <p>{city.name}</p>
                                        </div>
                                }) : null
                            }
                        </div>
                    </label>
                </div>
                
                <div className="listing-form-part">
                    <h2>ბინის დეტალები</h2>
                    <label className={price.length === 0 ? "" : (checkPrice() ? "correct" : "incorrect")}>
                        ფასი
                        <input type="text" name="name" onChange={(e) => setPrice(e.target.value)} value={price}  required/>
                        <p>
                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 1.4082L4.125 9.59002L1 5.87101" stroke="#021526" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            &nbsp;
                            მხოლოდ რიცხვები
                        </p>
                    </label>

                    <label className={area.length === 0 ? "" : (checkArea() ? "correct" : "incorrect")}>
                        ფართობი
                        <input type="text" name="name" onChange={(e) => setArea(e.target.value)} value={area} required/>
                        <p>
                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 1.4082L4.125 9.59002L1 5.87101" stroke="#021526" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            &nbsp;
                            მხოლოდ რიცხვები
                        </p>
                    </label>

                    <label className={bedrooms.length === 0 ? "" : (checkBedrooms() ? "correct" : "incorrect")}>
                        საძინებლების რაოდენობა
                        <input type="text" name="name" onChange={(e) => setBedrooms(e.target.value)} value={bedrooms} required/>
                        <p>
                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 1.4082L4.125 9.59002L1 5.87101" stroke="#021526" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            &nbsp;
                            მხოლოდ რიცხვები
                        </p>
                    </label>

                    <label className={description.length === 0 ? "" : (checkDescription() ? "correct" : "incorrect")} id="description">
                        აღწერა *
                        <textarea type="text" name="name" onChange={(e) => setDescription(e.target.value)} value={description}  required/>
                        <p>
                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 1.4082L4.125 9.59002L1 5.87101" stroke="#021526" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            &nbsp;
                            მინიმუმ 5 სიტყვა
                        </p>
                    </label>
                    
                    <label id="post-photo" className={imageBase64.length === 0 ? "" : (checkImage() ? "correct" : "incorrect")}>
                        ატვირთეთ ფოტო*
                        <label>
                            {imageBase64 === '' ? <PlusSvg /> : <ImgUploaded />}

                            <input id="listing-photo" type="file" name="avatar" onChange={() => listingPhotoUploaded()} required/>
                        </label>
                    </label>
                </div>


                <div className="listing-form-part">
                    <h2>აგენტი</h2>
                    <label className="of-custom-dropdown">
                        აირჩიე
                        <div className="custom-dropdown dp-reverse">
                            <div className={selectedDropdown === "agents" ? "dp dp-top" : "dp dp-top"} onClick={() => {updateDropdown("agents"); getAllAgents();}}>
                                {
                                    agent_id == '' ? <p>აირჩიე</p> : <p>{agents.find((a) => a.id == agent_id)?.name} {agents.find((a) => a.id == agent_id)?.surname}</p>
                                }

                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={selectedDropdown === "agents" ? "svg-rotated" : ""}>
                                    <path d="M3.91232 4.83785C3.68451 4.61004 3.31516 4.61004 3.08736 4.83785C2.85955 5.06565 2.85955 5.435 3.08736 5.6628L6.58736 9.1628C6.81516 9.39061 7.18451 9.39061 7.41232 9.1628L10.9123 5.6628C11.1401 5.435 11.1401 5.06565 10.9123 4.83785C10.6845 4.61004 10.3152 4.61004 10.0874 4.83785L6.99984 7.92537L3.91232 4.83785Z" fill="#021526"/>
                                </svg>

                            </div>
                            {
                                selectedDropdown === "agents" ? <div className="dp dp-middle" onClick={() => {toggleAgent(); updateDropdown("");}}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12 8V16" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M8 12H16" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    დაამატე აგენტი
                                </div>: null
                            }
                            {
                                selectedDropdown === "agents" ? agents.filter((agent) => agent.id != agent_id).map((agent) => {
                                        return <div className="dp dp-middle" onClick={() => {setAgentId(agent.id); updateDropdown("");}}>
                                            <p>{agent.name} {agent.surname}</p>
                                        </div>
                                }) : null
                            }
                            
                        </div>
                    </label>
                </div>
                        
                
                <div className="move-right">
                    <div className="btn-group">
                        <button className="btn-secondary" onClick={backTo}>გაუქმება</button>
                        <button type="submit" className="btn-primary">დაამატე ლისტინგი</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ListingForm;
