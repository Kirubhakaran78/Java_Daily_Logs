import React, { useState } from 'react'

function UserForm() {

const [formData,setFormData]=useState({name:"",age:"",email:""});


const handleChange= (e)=>{
    setFormData({...formData,[e.target.name] : e.target.name==="age"?Number(e.target.value): e.target.value});
}


const handleSubmit= async(e)=>{
    e.preventDefault();

    const response=await fetch("http://localhost:8082/api/users/saveEmp",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(formData)
    })

    if(response.ok){
        alert("User saved");
        setFormData({name:"",age:"",email:""});
    }else{
        alert("error in saving");
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
