import { createContext, useContext } from "react";

export const AuthContext = createContext() 
export const useAuth = () => useContext(AuthContext);  //useContext retorna las variables que provee un contexto en especifico
