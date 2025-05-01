 /* eslint-disable react/prop-types */
 import { createContext, useEffect, useState } from "react";
 import { createUserWithEmailAndPassword, deleteUser, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, reauthenticateWithCredential} from "firebase/auth";
 import app from "../Auth/Firebase/firebase.init";
 import Swal from 'sweetalert2'; // Import SweetAlert2

 export const AuthC = createContext();
 const auth = getAuth(app);

 const googleProvider = new GoogleAuthProvider();


 const AuthProviderx = ({ children }) => {
     const[user, setUser] = useState(null);
     const[loading, setLoading] = useState(true);

     const createNewUser = (email, password) => {
         setLoading(true)
         return createUserWithEmailAndPassword(auth, email, password)
     };
     const googleSignIn = () => {
         return signInWithPopup(auth, googleProvider)
     }
     const logOut = () => {
        Swal.fire({
            title: 'Logout',
            text: 'Want to LogOut?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Sign Out',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                signOut(auth)
                    .then(() => {
                        Swal.fire('Success', 'Logged out successfully!', 'success');
                    })
                    .catch((error) => {
                        console.error("Error logging out:", error);
                        Swal.fire('Error', `Could not log out: ${error.message}`, 'error');
                    })
                    .finally(() => setLoading(false));
            }
        });
    };
     const logIn = (email, password) =>{
         setLoading(true)
         return signInWithEmailAndPassword(auth, email, password)
     }
     const updateP = (updatedData) => {
         return updateProfile(auth.currentUser , updatedData)
     }

     const deleteAccount = async () => {
         Swal.fire({
             title: 'Are you sure?',
             text: "You won't be able to revert this!",
             icon: 'warning',
             showCancelButton: true,
             confirmButtonColor: '#3085d6',
             cancelButtonColor: '#d33',
             confirmButtonText: 'Yes, delete it!'
         }).then(async (result) => {
             if (result.isConfirmed) {
                 setLoading(true);
                 try {
                     await deleteUser(auth.currentUser);
                     Swal.fire(
                         'Deleted!',
                         'Your account has been deleted.',
                         'success'
                     );

                 } catch (error) {
                     console.error("Error deleting account:", error);
                     if (error.code === 'auth/requires-recent-login') {
                         console.log("Requires recent login. Re-authenticating...");
                         if (user.providerData.some(provider => provider.providerId === googleProvider.providerId)) {
                             try {
                                 const reauthResult = await Swal.fire({
                                     title: 'Re-authentication Required',
                                     text: 'For security reasons, please sign in with Google again to delete your account.',
                                     icon: 'info',
                                     showCancelButton: true,
                                     confirmButtonText: 'Sign in with Google',
                                     cancelButtonText: 'Cancel',
                                 });

                                 if (reauthResult.isConfirmed) {
                                     const result = await signInWithPopup(auth, googleProvider);
                                     const credential = GoogleAuthProvider.credentialFromResult(result);
                                     await reauthenticateWithCredential(auth.currentUser, credential);
                                     await deleteUser(auth.currentUser);
                                     Swal.fire(
                                         'Deleted!',
                                         'Your account has been deleted.',
                                         'success'
                                     );

                                 }
                             } catch (reauthError) {
                                 console.error("Error re-authenticating with Google:", reauthError);
                                 Swal.fire(
                                     'Error',
                                     'Could not re-authenticate with Google. Please try again.',
                                     'error'
                                 );
                             }
                         } else {
                             Swal.fire(
                                 'Re-authentication Required',
                                 'For security reasons, please log in again to delete your account.',
                                 'info'
                             );
                             // Optionally, redirect to login page
                         }
                     } else {
                         Swal.fire(
                             'Error',
                             'There was an error deleting your account. Please try again later.',
                             'error'
                         );
                         console.error("Error deleting account:", error);
                     }
                 } finally {
                     setLoading(false);
                 }
             }
         });
     }

 const authInfo = {
     user,
     setUser,
     createNewUser,
     logOut,
     logIn,
     loading,
     updateP,
     googleSignIn,
     deleteAccount
 };
 useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, currentUser => {
         setUser(currentUser)
         setLoading(false)
     })
     return () => {
         unsubscribe();
     }
 }, [])
     return <AuthC.Provider value={authInfo}>{ children }</AuthC.Provider>
 };

 export default AuthProviderx;