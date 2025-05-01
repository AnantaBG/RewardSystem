/* eslint-disable no-unused-vars */
import {  useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { Button, Label, TextInput } from "flowbite-react";
import Swal from "sweetalert2";
import { AuthC } from "./AuthProviderx";
import UseAxiosPublic from "./UseAxiosPublic";
import { Helmet } from "react-helmet";

const Login = () => {
const {logIn, setUser, googleSignIn} = useContext(AuthC);
const axiosPublic = UseAxiosPublic();
const location = useLocation();
const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
  const handleSubmit=(e) =>{
    e.preventDefault();
    const form = e.target;
    const email = form.email?.value;
    const password = form.password?.value;




    logIn(email, password)
    .then(result =>{
      const user = result.user;
      setUser(user);
      navigate(location?.state ? location.state : "/")
      Swal.fire({
        icon: 'success',
        title: 'Congratualtions!',
        text: 'User Login Successfully',
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      // const errorMessage = error.message;
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `${errorCode}`,
      });    
    });
  }
  const handleGoogleSignIn = () => {
    googleSignIn()
    .then(result => {
          
          const userInfo = {
            email: result.user?.email,
            name: result.user?.displayName
          }
          axiosPublic.post('/users', userInfo)
              .then(res =>
                
              {
                if(res.data.insertedId){
                  Swal.fire({
                              icon: 'success',
                              title: 'Congratualtions!',
                              text: 'Google Login/Register Successfully',
                            });
                }
                navigate(location?.state ? location.state : "/")
              })
        })
  }

    return (
      <div className="my-10 w-9/12 mx-auto">
        <Helmet>
        <title>ReTask || Login</title>
    </Helmet>
        <form onSubmit={handleSubmit}  className="flex max-w-screen-md  mx-auto flex-col gap-4">
          <label className="text-4xl font-extrabold mx-auto">Login</label>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email1" value="Your email" />
        </div>
        <TextInput name="email" id="email" type="email" placeholder="Type your Email" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Your password" />
        </div>
        <TextInput  name="password" type={showPassword ? "text" : "password"} placeholder="Password" required />
      </div>
      <div className="flex justify-end mr-8">
      <button className=" -translate-y-11  " type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaRegEyeSlash></FaRegEyeSlash> : <FaRegEye></FaRegEye>}
      </button>
      </div>
      <Button type="submit"><span className="text-2xl">Login</span></Button>
        </form>
    <div onClick={handleGoogleSignIn} className="flex flex-col max-w-md mx-auto m-5">
    <Button outline gradientDuoTone="cyanToBlue" type="Login"><FcGoogle className="text-3xl"></FcGoogle> <span className="text-2xl">Login With Google</span>
    </Button>
    </div>
    <p className="mx-auto text-center">Dont have a Account? <Link  className="text-red-500 underline" to="/register">Register!</Link></p>
    </div>

    );
};

export default Login;