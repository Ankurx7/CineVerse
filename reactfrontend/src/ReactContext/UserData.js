import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = React.createContext();

const AuthContextProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState(null);
  const [config, setConfig] = useState({
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  // Fetch user data
  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get("${process.env.REACT_APP_API_BASE_URL}/auth/private", config);
      setActiveUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("authToken");
      setActiveUser(null);
    }
  }, [config]); 

  useEffect(() => {
    fetchUser();
  }, [fetchUser]); 


  useEffect(() => {
    setConfig({
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
  }, [localStorage.getItem("authToken")]);

  return (
    <AuthContext.Provider value={{ activeUser, setActiveUser, config, setConfig }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
