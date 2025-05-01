/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
 import { Link, useLocation, useNavigate } from "react-router-dom";
 import { FcGoogle } from "react-icons/fc";
 import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
 import { Button, Label, TextInput } from "flowbite-react";
 import Swal from "sweetalert2";
 import UseAxiosPublic from "./UseAxiosPublic";
 import { AuthC } from "./AuthProviderx";
 import { Helmet } from "react-helmet";


 const Register = () => {
  const axiosPublic = UseAxiosPublic();
  const {createNewUser, setUser, updateP, googleSignIn} = useContext(AuthC);
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
 const navigate = useNavigate();


  const handleSubmit=(e) =>{
   e.preventDefault();
   const form = new FormData(e.target);
   const Name = form.get("Name");
   const Email = form.get("Email");
   const Photo = form.get("Photo");
   const Password = form.get("password");
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
   if(!passwordRegex.test(Password)){
    setError({...error, Password:"Password must have at least 6 characters, One Uppercase letter, and One Lowercase letter."})
    return;
   }

   createNewUser(Email, Password)
   .then(result =>{
    const user = result.user;
    
    updateP({displayName:Name, photoURL:Photo})
    
    .then(
      () => {
        const userInfo = {
          name: Name,
          email: Email
        }
        axiosPublic.post('/users', userInfo)
        .then(res =>
        {
          if(res.data.insertedId){
            Swal.fire({
                        icon: 'success',
                        title: 'Congratualtions!',
                        text: 'User Created Successfully',
                      });
          }
        })
      }
    );
    setUser(user);
    navigate(location?.state ? location.state : "/")
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
  const handleGoogleSignUp = () => {
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
        <title>ReTask || Register</title>
    </Helmet>
      <div>

            <form onSubmit={handleSubmit}  className="flex max-w-screen-md  mx-auto flex-col gap-4">
                <label className="text-4xl font-extrabold mx-auto">Register</label>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Your Name" />
              </div>
              <TextInput name="Name" type="text" placeholder="Name" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="photo" value="Photo Url" />
              </div>
              <TextInput name="Photo" type="text" placeholder="Photo_Url" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput name="Email" id="email" type="email" placeholder="Type your Email" required />
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
            <Button type="submit"><span className="text-2xl">Register</span></Button>
              </form>
              <div onClick={handleGoogleSignUp} className="flex flex-col max-w-md mx-auto m-5">
              <Button outline gradientDuoTone="cyanToBlue" type="Login"><FcGoogle className="text-3xl"></FcGoogle> <span className="text-2xl">SignUP With Google</span>
              </Button>
              </div>
        </div>
        {
              error.Password && (
                <label className="label text-xs text-red-600">
                {
                  error.Password
                }
              </label>
              )
          }
          <p className="mx-auto text-center">Already Have an Account! <Link  className="text-red-500 underline" to="/login">Login Now!</Link></p>
</div>
    );
};

export default Register;