/* eslint-disable no-unused-vars */
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthC } from "../Auth/AuthProviderx";
import { FaUser } from "react-icons/fa";
import R from "../../assets/Gemini_Generated_Image_sl6g11sl6g11sl6g-removebg-preview.png"
import SocialShareButton from "../SocialShareButton";
const NavBar = () => {
    const { user, logOut} = useContext(AuthC);
    const location = useLocation(); // Get the current location

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="sticky z-50 backdrop:blur-3xl top-0 mb-1">
            <Navbar fluid rounded className="bg-blue-100">
                <Navbar.Brand href="/">
                    <img src={R} className="mr-3 rounded-sm h-6 sm:h-9" alt="ReTask" />
                </Navbar.Brand>
                <div className="flex lg:order-2">
    <Dropdown
        arrowIcon={false}
        inline
        label={
            user?.photoURL ? (
                <Avatar alt="User settings" img={user?.photoURL} rounded />
            ) : (
                <Avatar alt="User settings" icon={<FaUser />} rounded />
            )
        }
    >
        {user && user?.email ? (
            <div>
                <Dropdown.Header>
                    <span className="block text-sm">{user?.displayName}</span>
                    <span className="block truncate text-sm font-medium">{user?.email}</span>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logOut}>Sign out</Dropdown.Item>
            </div>
        ) : (
            <Dropdown.Item href="/login">Login</Dropdown.Item>
        )}
    </Dropdown>
                    <Navbar.Toggle />
                </div>
                <Navbar.Collapse>
                    <NavLink to="/" className={({ isActive }) => isActive ? "text-green-500" : ""}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/posts" className={({ isActive }) => isActive ? "text-green-500" : ""}>
                        All Posts
                    </NavLink>
                    {user && user?.email ? (
                        <div onClick={logOut}>
                            <NavLink to="#" className={({ isActive }) => isActive ? "text-black" : ""}>
                                LogOut
                            </NavLink>
                        </div>
                    ) : (
                        <NavLink to="/login" className={({ isActive }) => isActive ? "text-red-500" : ""}>
                            Login
                        </NavLink>
                    )}
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

export default NavBar;