import { createContext, useContext, useState } from "react";
import { API_BASE_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(localStorage.getItem("token"));
  const isAuthenticated = !!token;


 const login = async (email,password)=>{

  const response = await fetch("http://127.0.0.1:8000/auth/login",{
    method:"POST",
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
    body:new URLSearchParams({
      username:email,
      password:password
    })
  })

  const data = await response.json()

  localStorage.setItem("token",data.access_token)

  setToken(data.access_token)
  return true;  

}

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout,isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};