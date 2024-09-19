import React, {useState, useEffect} from "react";
import "./ListingForm.css";
import "../../UI elements/Button/button.css";

function ListingForm({backTo = () => {}}) {
    // The API states
    const [address, setAddress] = useState('');
    const [image, setImage] = useState(null);
    const [imageBase64, setImageBase64] = useState('');
    const [region_id, setRegionId] = useState('1');
    const [description, setDescription] = useState('');
    const [city_id, setCityId] = useState('1');
    const [zip_code, setZipCode] = useState('');
    const [price, setPrice] = useState('');
    const [area, setArea] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [is_rental, setIsRental] = useState('0');
    const [agent_id, setAgentId] = useState('');

    const [regions, setRegions] = useState([]);
    const [cities, setCities] = useState([]);
    const [agents, setAgents] = useState([]);

    // Get the regions and the cities
    const getAllRegions = async () => {
        try {
            const reg = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/regions');
        
            setRegions(await reg.json());
        } catch (error) {
            console.log(error);
        }
        
    }

    const getAllCities = async () => {
        try {
            const cit = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/cities');

            setCities(await cit.json());
        } catch (error) {
            console.log(error);
        }
        
    }

    const updateRegion = async (regId) => {
        setRegionId(regId);
        const mycities = cities.filter((city) => city.region_id == regId);
        setCityId(mycities[0].id);
    }

    // Get the agents
    const getAllAgents = async () => {
        try {
            const ags = await fetch('https://api.real-estate-manager.redberryinternship.ge/api/agents', {
                headers: {
                  'Authorization': 'Bearer 9d07c60a-2a96-4377-a1a4-5b313b5d9773'
                }
              });
              

            const agentArr = await ags.json();
            setAgents(agentArr);
            if (agentArr.length > 0) {
                setAgentId(agentArr[0].id);
            }

        } catch (error) {
            console.log(error);
        }
        
    }

    // UseEffect hook
    useEffect(() => {
        getAllRegions();
        getAllCities();
        getAllAgents();
    }, [])

    // Image to Base64
    let base64String = "";

    function listingPhotoUploaded() {
        // Get the uploaded file
        let file = document.querySelector(
            '#listing-photo')['files'][0];

        // Check if the file is valid
        if (file === undefined || file === null) {
            return false;
        }

        // Check if the uploaded file is of an image type
        let parts = file.name.split('.')
        let extension = parts[parts.length - 1];

        switch (extension.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'bmp':
            case 'png':
            case 'tiff':
                break;
            default:
                setImage(null);
                setImageBase64('');
                return false;
        }

        // Check if the image file size is over 1mb
        const fileSizeMB = (file.size / (1024 * 1024));

        if (fileSizeMB > 1) {
            window.alert("Image is too big, please upload an image less than 1mb in size.")
            setImage(null);
            setImageBase64('');
            return false;
        }

        // Continues if the file is of correct type
        // Translate to base64
        let reader = new FileReader();

        reader.onload = function () {
            base64String = reader.result.replace("data:", "")
                .replace(/^.+,/, "");
            setImage(file);
            setImageBase64(base64String);
        }
        
        reader.readAsDataURL(file);
    }

    // For closing and opening the agent form
    function toggleAgent() {
        const agentForm = document.getElementById("agent-form");
        agentForm.classList.toggle("hidden");
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
        return (description.split(" ").length >= 5);
    }

    function checkRequirements() {
        return checkAdress() && checkImage() && checkZipCode() && checkPrice() && checkArea() && checkBedrooms() && checkDescription();
        }

    // Handling the fetch data
    const fetchHandle = async e => {
        e.preventDefault(); // So it doesn't close

        // Check if all data is correct
        if (!checkRequirements()) {
            return false;
        }

        // If it is all correct, send it via POST method
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

            let res = await fetch("https://api.real-estate-manager.redberryinternship.ge/api/real-estates", {
                    method: "POST",
                    headers: {
                        'accept': 'application/json',
                        'Authorization': 'Bearer 9d07c60a-2a96-4377-a1a4-5b313b5d9773',
                    },
                    body: form,
                });

                // If the status is 201, then close the agent form
                if (res.status === 201) {
                    window.alert("ლისტინგი დაემატა წარმატებით!")
                    backTo();
                } else {
                    window.alert("ლისტინგის დამატება ვერ მოხერხდა, გთხოვთ სცადოთ თავიდან.")
                    console.log(res);
                }
        } catch (err) {
            throw(err);
        }
        
        
        
    }

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

    // Return the entire div
     return <div className="listing-form" id="listing-form">
            <h1>ლისტინგის დამატება</h1>
            
            <form onSubmit={fetchHandle}>
                <div className="listing-form-part">
                    <h2>გარიგების ტიპი</h2>
                    <div className="flex-row" required>
                        <input type="radio" id="იყიდება" name="გარიგება" value={0} onClick={(e) => setIsRental(e.target.value)} checked={is_rental == 0}></input>
                        <label>
                            იყიდება
                        </label>
                        
                        
                        <input type="radio" id="ქირავდება" name="გარიგება" value={1} onClick={(e) => setIsRental(e.target.value)} checked={is_rental == 1}></input>
                        <label>
                            ქირავდება
                        </label>
                    </div> 
                </div>

                <div className="listing-form-part">
                    <h2>მდებარეობა</h2>
                    <label className={address.length === 0 ? "" : (checkAdress() ? "correct" : "incorrect")}>
                        მისამართი *
                        <input type="text" name="name" onChange={(e) => setAddress(e.target.value)} required/>
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
                        <input type="text" name="name" onChange={(e) => setZipCode(e.target.value)} required/>
                        <p>
                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 1.4082L4.125 9.59002L1 5.87101" stroke="#021526" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            &nbsp;
                            მხოლოდ რიცხვები
                        </p>
                    </label>
                    <label>
                        რეგიონი
                        <select id="region" name="region" onChange={(i) => updateRegion(i.target.value)} required>
                            {
                                regions.map((e) => {
                                    return <option value={e.id}>{e.name}</option>
                                })
                            }
                        </select>
                    </label>
                    <label>
                        ქალაქი
                        <select id="region" name="region" onChange={(i) => setCityId(i.target.value)} required>
                            {
                                cities.filter((city) => city.region_id == region_id).map((city) => {
                                    return <option value={city.id}>{city.name}</option>
                                }) 
                            }
                        </select>
                    </label>
                </div>
                
                <div className="listing-form-part">
                    <h2>ბინის დეტალები</h2>
                    <label className={price.length === 0 ? "" : (checkPrice() ? "correct" : "incorrect")}>
                        ფასი
                        <input type="text" name="name" onChange={(e) => setPrice(e.target.value)} required/>
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
                        <input type="text" name="name" onChange={(e) => setArea(e.target.value)} required/>
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
                        <input type="text" name="name" onChange={(e) => setBedrooms(e.target.value)} required/>
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
                        <textarea type="text" name="name" onChange={(e) => setDescription(e.target.value)} required/>
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
                    <label>
                        აირჩიე
                        <select id="region" name="region" onChange={(i) => setAgentId(i.target.value)} required>
                            <option>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 8V16" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M8 12H16" stroke="#2D3648" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                დაამატე აგენტი
                            </option>
                            {
                                agents.map((a) => {
                                    return <option value={a.id}>{a.name}</option>
                                }) 
                            }
                        </select>
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
}

export default ListingForm;