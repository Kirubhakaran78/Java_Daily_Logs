import React, { useEffect, useState } from 'react'
import axios from 'axios';

function UserTable() {
    const [users, setusers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8082/api/users/fetchAllEmp")
            .then((response) => {
                setusers(response.data)
            })
            .catch((error) => {
                alert("Error in fetching users: " + error);
            })


    }, [])


    return (
        <div>
            <h2>User List</h2>
            <table border={1}>

                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Email</th>
                </tr>
                </thead>

                <tbody>
                    {users.map((user, index) =>( 
                        <tr key={index}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.age}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default UserTable
