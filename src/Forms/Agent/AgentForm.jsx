import React, {useState} from "react";
import "./AgentForm.css";
import "../../UI elements/Button/button.css";

function AgentForm() {
    // The API states
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);

    // Image to Base64
    let base64String = "";

    function imageUploaded() {
        // Get the uploaded file
        let file = document.querySelector(
            '#avatar-photo')['files'][0];

        // Check if the file is valid
        if (file === undefined || file === null) {
            return false;
        }

        // Check if the uploaded file is of an image type
        let parts = file.name.split('.')
        let extension = parts[parts.length - 1];

        // Check if the image file size is over 1mb
        const fileSizeMB = (file.size / (1024 * 1024));

        if (fileSizeMB > 1) {
            window.alert("Image is too big, please upload an image less than 1mb in size.")
            setAvatarFile(null);
            setAvatar('');
            return false;
        }

        switch (extension.toLowerCase()) {
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'bmp':
            case 'png':
            case 'tiff':
                break;
            default:
                setAvatar('');
                setAvatarFile(null);
                return false;
        }

        // Continues if the file is of correct type
        // Translate to base64
        let reader = new FileReader();

        reader.onload = function () {
            base64String = reader.result.replace("data:", "")
                .replace(/^.+,/, "");
            setAvatar(base64String);
            setAvatarFile(file);
        }
        
        reader.readAsDataURL(file);
    }

    // For closing and opening the agent form
    function toggleAgent() {
        const agentForm = document.getElementById("agent-form");
        agentForm.classList.toggle("hidden");
    }
    
    // Checking each field for requierements
    function checkLength(toCheck) {
        return (toCheck.length >= 2);
    }

    function checkName() {return checkLength(name);}
    function checkSurname() {return checkLength(surname);}

    function checkEmail() {
        return (email.slice(-12) === "@redberry.ge");
    }

    function checkPhone() {
        return (/^\d+$/.test(phone) && phone.length === 9 && phone[0] === "5");
    }

    function checkFile() {
        return (avatar.length >= 0 && avatarFile !== null);
    }

    function checkRequirements() {
        return checkName() && checkSurname() && checkEmail() && checkPhone() && checkFile();
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
            form.append('name', name);
            form.append('surname', surname);
            form.append('email', email);
            form.append('phone', phone);
            form.append('avatar', avatarFile);

            let res = await fetch("https://api.real-estate-manager.redberryinternship.ge/api/agents", {
                    method: "POST",
                    headers: {
                        'Authorization': 'Bearer 9d07c60a-2a96-4377-a1a4-5b313b5d9773',
                    },
                    body: form,
                });

                // If the status is 201, then close the agent form
                if (res.status === 201) {
                    window.alert("აგენტი დაემატა წარმატებით!")
                    toggleAgent();
                } else {
                    window.alert("აგენტის დამატება ვერ მოხერხდა, გთხოვთ სცადოთ თავიდან.")
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
            <img src={"data:image/jpg;base64,"+avatar} alt=""/>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setAvatar('')}>
                <circle cx="12" cy="12" r="11.5" fill="white" stroke="#021526"/>
                <path d="M6.75 8.5H7.91667H17.25" stroke="#021526" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16.0834 8.50033V16.667C16.0834 16.9764 15.9605 17.2732 15.7417 17.492C15.5229 17.7107 15.2262 17.8337 14.9167 17.8337H9.08341C8.774 17.8337 8.47725 17.7107 8.25846 17.492C8.03966 17.2732 7.91675 16.9764 7.91675 16.667V8.50033M9.66675 8.50033V7.33366C9.66675 7.02424 9.78966 6.72749 10.0085 6.5087C10.2272 6.28991 10.524 6.16699 10.8334 6.16699H13.1667C13.4762 6.16699 13.7729 6.28991 13.9917 6.5087C14.2105 6.72749 14.3334 7.02424 14.3334 7.33366V8.50033" stroke="#021526" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10.8333 11.417V14.917" stroke="#021526" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.1667 11.417V14.917" stroke="#021526" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    }

    // Return the entire div
     return <div className="agent-form hidden" id="agent-form" onClick={toggleAgent}>
        <div className="agent-form-inside" onClick={toggleAgent}>
            <h1>აგენტის დამატება</h1>
            
            <form onSubmit={fetchHandle}>
                <label className={name.length === 0 ? "" : (checkName() ? "correct" : "incorrect")}>
                    სახელი*
                    <input type="text" name="name" onChange={(e) => setName(e.target.value)} required/>
                    <p>
                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 1.4082L4.125 9.59002L1 5.87101" stroke="#021526" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        &nbsp;
                        მინიმუმ ორი სიმბოლო
                    </p>
                </label>

                <label className={surname.length === 0 ? "" : (checkSurname() ? "correct" : "incorrect")}>
                    გვარი*
                    <input type="text" name="surname" onChange={(e) => setSurname(e.target.value)} required/>
                    <p>
                    <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 1.4082L4.125 9.59002L1 5.87101" stroke="#021526" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                        &nbsp;
                        მინიმუმ ორი სიმბოლო
                    </p>
                </label>

                <label className={email.length === 0 ? "" : (checkEmail() ? "correct" : "incorrect")}>
                    ელ-ფოსტა*
                    <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} required/>
                    <p>
                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 1.4082L4.125 9.59002L1 5.87101" stroke="#021526" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        &nbsp;
                        გამოიყენეთ @redberry.ge ფოსტა
                    </p>
                </label>

                <label className={phone.length === 0 ? "" : (checkPhone() ? "correct" : "incorrect")}>
                    ტელეფონის ნომერი*
                    <input type="text" name="phone" onChange={(e) => setPhone(e.target.value)} required/>
                    <p>
                        <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 1.4082L4.125 9.59002L1 5.87101" stroke="#021526" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        &nbsp;
                        მხოლოდ რიცხვები
                    </p>
                </label>

                <label id="post-photo" className={avatar.length === 0 ? "" : (checkFile() ? "correct" : "incorrect")}>
                    ატვირთეთ ფოტო*
                    <label>
                        {avatar === '' ? <PlusSvg /> : <ImgUploaded />}

                        <input id="avatar-photo" type="file" name="avatar" onChange={() => imageUploaded()} required/>
                    </label>
                </label>
                <div className="move-right">
                    <div className="btn-group">
                        <button className="btn-secondary" onClick={toggleAgent}>გაუქმება</button>
                        <button type="submit" className="btn-primary">დაამატე აგენტი</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
}

export default AgentForm;