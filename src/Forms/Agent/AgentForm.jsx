import React, { useState, useEffect } from "react";
import "./AgentForm.css";
import "../../UI elements/Button/button.css";

function AgentForm() {
  const initialFormData = {
    name: '',
    surname: '',
    email: '',
    phone: '',
    avatar: '',
    avatarFile: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const { name, surname, email, phone, avatar, avatarFile } = formData;

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Image to Base64
  const imageUploaded = () => {
    const file = document.querySelector('#avatar-photo').files[0];

    if (!file) return false;

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 1) {
      alert("Image is too big, please upload an image less than 1MB in size.");
      setField('avatarFile', null);
      setField('avatar', '');
      return false;
    }

    const validExtensions = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'tiff'];
    const extension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(extension)) {
      setField('avatarFile', null);
      setField('avatar', '');
      return false;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.replace(/^data:.+;base64,/, '');
      setField('avatar', base64String);
      setField('avatarFile', file);
    };
    reader.readAsDataURL(file);
  };

  // Toggle form visibility
  const toggleAgent = () => {
    setFormData(initialFormData); // Clear the input data
    document.getElementById("agent-form").classList.toggle("hidden");
  };

  // Field validation functions
  const checkLength = (field) => field.length >= 2;
  const checkName = () => checkLength(name);
  const checkSurname = () => checkLength(surname);
  const checkEmail = () => email.endsWith("@redberry.ge");
  const checkPhone = () => phone.length === 9 && phone.startsWith("5") && /^\d+$/.test(phone);
  const checkFile = () => avatar.length > 0 && avatarFile !== null;

  const checkRequirements = () => checkName() && checkSurname() && checkEmail() && checkPhone() && checkFile();

  // Form submission handler
  const fetchHandle = async (e) => {
    e.preventDefault();

    if (!checkRequirements()) return;

    try {
      const form = new FormData();
      form.append('name', name);
      form.append('surname', surname);
      form.append('email', email);
      form.append('phone', phone);
      form.append('avatar', avatarFile);

      const res = await fetch("https://api.real-estate-manager.redberryinternship.ge/api/agents", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer 9d07c60a-2a96-4377-a1a4-5b313b5d9773',
        },
        body: form,
      });

      if (res.status === 201) {
        alert("აგენტი დაემატა წარმატებით!");
        toggleAgent();
      } else {
        alert("აგენტის დამატება ვერ მოხერხდა, გთხოვთ სცადოთ თავიდან.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Plus icon as a separate component
  const PlusSvg = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 8V16" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 12H16" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Uploaded image display component
  const ImgUploaded = () => (
    <div>
      <img src={`data:image/jpg;base64,${avatar}`} alt="uploaded avatar" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setField('avatar', '')}>
        <circle cx="12" cy="12" r="11.5" fill="white" stroke="#021526" />
        <path d="M6.75 8.5H7.91667H17.25" stroke="#021526" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.0834 8.50033V16.667C16.0834 16.9764 15.9605 17.2732 15.7417 17.492C15.5229 17.7107 15.2262 17.8337 14.9167 17.8337H9.08341C8.774 17.8337 8.47725 17.7107 8.25846 17.492C8.03966 17.2732 7.91675 16.9764 7.91675 16.667V8.50033M9.66675 8.50033V7.33366C9.66675 7.02424 9.78966 6.72749 10.0085 6.5087C10.2272 6.28991 10.524 6.16699 10.8334 6.16699H13.1667C13.4762 6.16699 13.7729 6.28991 13.9917 6.5087C14.2105 6.72749 14.3334 7.02424 14.3334 7.33366V8.50033" stroke="#021526" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10.8333 11.417V14.917" stroke="#021526" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.1667 11.417V14.917" stroke="#021526" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  return (
    <div className="agent-form hidden" id="agent-form" onClick={() => toggleAgent}>
      <div className="agent-form-inside" onClick={() => toggleAgent}>
        <h1>აგენტის დამატება</h1>
        <form onSubmit={fetchHandle}>
          <label className={name ? (checkName() ? "correct" : "incorrect") : ""}>
            სახელი*
            <input type="text" name="name" onChange={(e) => setField('name', e.target.value)} value={name} required />
            <p>მინიმუმ ორი სიმბოლო</p>
          </label>

          <label className={surname ? (checkSurname() ? "correct" : "incorrect") : ""}>
            გვარი*
            <input type="text" name="surname" onChange={(e) => setField('surname', e.target.value)} value={surname} required />
            <p>მინიმუმ ორი სიმბოლო</p>
          </label>

          <label className={email ? (checkEmail() ? "correct" : "incorrect") : ""}>
            ელ-ფოსტა*
            <input type="email" name="email" onChange={(e) => setField('email', e.target.value)} value={email} required />
            <p>გამოიყენეთ @redberry.ge ფოსტა</p>
          </label>

          <label className={phone ? (checkPhone() ? "correct" : "incorrect") : ""}>
            ტელეფონის ნომერი*
            <input type="text" name="phone" onChange={(e) => setField('phone', e.target.value)} value={phone} required />
            <p>მხოლოდ რიცხვები</p>
          </label>

          <label id="post-photo" className={avatar ? (checkFile() ? "correct" : "incorrect") : ""}>
            ატვირთეთ ფოტო*
            <label>
              {avatar ? <ImgUploaded /> : <PlusSvg />}
              <input id="avatar-photo" type="file" name="avatar" onChange={imageUploaded} required />
            </label>
          </label>

          <div className="move-right">
            <div className="btn-group">
              <button type="button" className="btn-secondary" onClick={toggleAgent}>გაუქმება</button>
              <button type="submit" className="btn-primary">შენახვა</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AgentForm;
