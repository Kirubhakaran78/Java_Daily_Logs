import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { config } from "../services/api";

export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [empId, setEmpId] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  // Load user from sessionStorage
  const getUserFromSession = () => {
    const stored = sessionStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  };

  const saveUserToSession = (u) => {
    sessionStorage.setItem("currentUser", JSON.stringify(u));
  };

  // Real refresh function (reloads from session)
  const refreshUser = () => {
    const stored = getUserFromSession();
    setUser(stored);
    if (stored?.profilePic) setProfilePic(stored.profilePic);
  };

  // Load user on first render
  useEffect(() => {
    refreshUser();
  }, []);

  // When user changes → load employee details only ONCE
  useEffect(() => {
    if (!user) return;

    const loadEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:${config.BASE_URL}/Org_Management_java/api/masters/getAllEmp`
        );

        const emp = response.data.find(
          (e) => e.emp_name === user.username
        );

        if (emp) {
          setEmpId(emp.emp_id);

          // Update profilePic if missing
          if (!user.profilePic && emp.profile_pic) {
            setProfilePic(emp.profile_pic);

            const updated = { ...user, profilePic: emp.profile_pic };
            setUser(updated);
            saveUserToSession(updated);
          }
        }
      } catch (err) {
        console.error("Error loading employee info", err);
      }
    };

    loadEmployee();
  }, [user?.username]); // only run when username exists

  // Update user manually
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    if (updatedUser.profilePic) {
      setProfilePic(updatedUser.profilePic);
    }
    saveUserToSession(updatedUser);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        empId,
        profilePic,
        setProfilePic,
        updateUser,
        refreshUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

