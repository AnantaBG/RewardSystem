import { Outlet } from "react-router-dom";
import NavBar from "../components/HomePage/NavBar";

const HomePage = () => {
    return (
        <section>
            <NavBar></NavBar>
        <div className="flex min-h-[98vh] gap-2">
            <div className="bg-green-200 w-full border border-black  border-opacity-35  rounded-xl p-4"><Outlet/></div>        
        </div>
        </section>

    );
};

export default HomePage;