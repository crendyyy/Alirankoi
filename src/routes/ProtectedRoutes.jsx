import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotFound from "../pages/NotFound";

const ProtectedRoutes = ({ roles, children }) => {
  const { auth } = useContext(AuthContext);
  // Determine the user's role based on the is_admin flag
  const userRole = auth.user?.is_admin ? "admin" : "user";
  // console.log(auth.user);
  // console.log(userRole);

  // Check if the user's role is allowed
  if (roles.includes(userRole) && auth.user) {
    return children;
  }
  if (!auth.user || !roles.includes(userRole)) {
    return <NotFound />;
  }
};
export default ProtectedRoutes;
