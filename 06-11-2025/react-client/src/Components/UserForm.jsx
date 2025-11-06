import { useState } from 'react'
import axios from "axios";
import config from "../config.json"

function UserForm({ onUserReload }) {

  //config url path variables
  let baseUrl=config.API_BASE_URL;

  const [formData, setFormData] = useState({ name: "", age: "", email: "" });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.name === "age" ? Number(e.target.value) : e.target.value });
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    //const response = await axios.post(url, data, config);
    try {
      await axios.post(`${baseUrl}/saveEmp`,
        formData, // axios automatically converts to JSON
        {
          headers: { "Content-Type": "application/json" }
        });


      alert("User saved");
      setFormData({ name: "", age: "", email: "" });
      onUserReload();
    } catch (error) {
      alert("Error saving user: " + error.message);
    }

  }


  return (
    <div>
      <form onSubmit={handleSubmit} method='post'>

        <lable htmlFor="name">Name: </lable>
        <input
          type="text"
          id="name"
          name="name"
          placeholder='Enter name'
          value={formData.name}
          onChange={handleChange}
        />
        <br /><br />

        <lable htmlFor="age">Age: </lable>
        <input
          type="number"
          id="age"
          name="age"
          placeholder='Enter age'
          value={formData.age}
          onChange={handleChange}
        />
        <br /><br />

        <lable htmlFor="email">Email: </lable>
        <input
          type="text"
          id="email"
          name="email"
          placeholder='Enter email'
          value={formData.email}
          onChange={handleChange}
        />
        <br /><br />

        <button type='submit'>Add user</button>

      </form>
    </div>
  )
}

export default UserForm
