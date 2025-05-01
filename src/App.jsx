import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Allpages/HomePage";
import AllTasks from "./components/HomePage/SideBarComponents/AllTasks";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AuthProviderx from "./components/Auth/AuthProviderx";
import PrivateRoute from "./PrivateRoute";
import AllPosts from "./components/HomePage/SideBarComponents/AllPosts";



function App() {
    return (
        <div className="bg-blue-200 text-stone-900 min-h-screen p-2">
            <BrowserRouter>
                <AuthProviderx> {/* Wrap with AuthProvider */}
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<PrivateRoute />}> {/* Protect these routes */}
                            <Route path="/" element={<HomePage />}>
                                <Route index element={<AllTasks />} />
                                <Route path="/posts" index element={<AllPosts />} />
                            </Route>
                        </Route>
                         <Route path="*" element={<div>Page Not Found</div>} /> {/* Catch-all route */}
                    </Routes>
                </AuthProviderx>
            </BrowserRouter>
        </div>
    );
}

export default App;