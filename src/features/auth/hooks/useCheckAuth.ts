import { useEffect } from "react";
import useAuth from "./useAuth";

const useCheckAuth = () => {
  const { status, getProfile } = useAuth();
  useEffect(() => { getProfile() }, []);
  return status;
}

export default useCheckAuth;