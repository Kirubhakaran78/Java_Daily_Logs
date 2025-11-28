import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { getUserFromSession } from "../utils/auth";
import { config } from "../services/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [empId, setEmpId] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const sessionUser = getUserFromSession();
    if (!sessionUser) return;

    setUser(sessionUser);

    // 1️⃣ Load profile pic from session FIRST
    if (sessionUser.profilePic) {
      setProfilePic(sessionUser.profilePic);
    }

    // 2️⃣ Fetch employee extra details
    const loadEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:${config.BASE_URL}/api/masters/getAllEmp`
        );

        const emp = response.data.find(
          (e) => e.emp_name === sessionUser.username
        );

        if (emp) {
          setEmpId(emp.emp_id);

          // Only set DB picture if session does NOT have a new pic
          if (!sessionUser.profilePic) {
            setProfilePic(emp.profile_pic);
          }
        }
      } catch (err) {
        console.error("Failed to load employee info", err);
      }
    };

    loadEmployee();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, empId, profilePic, setProfilePic }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
