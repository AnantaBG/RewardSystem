import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, deleteUser, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from "../Auth/Firebase/firebase.init";
import Swal from 'sweetalert2'; // Import SweetAlert2
import UseAxiosPublic from "./UseAxiosPublic"; // Assuming this is the correct path

export const AuthC = createContext();
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();


const AuthProviderx = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = UseAxiosPublic(); // Initialize axiosPublic

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
    const logIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    const updateP = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData)
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
                    Swal.fire(
                        'Error',
                        'There was an error deleting your account. Please try again later.',
                        'error'
                    );
                } finally {
                    setLoading(false);
                }
            }
        });
    }
    const updateUserCreditPoints = async (email, points) => {
        try {
            const response = await axiosPublic.patch(`/users/credit/email/${email}`, { points }); // Use the new email-based endpoint
            console.log('Credit points updated for email:', email, response.data);
            // Update the local user state (if you have email in your user object)
            setUser(prevUser => {
                if (prevUser?.email === email) { // Assuming your user object has an email property
                    return { ...prevUser, creditPoints: (prevUser.creditPoints || 0) + points };
                }
                return prevUser;
            });
            return response.data; // Optionally return the response data
        } catch (error) {
            console.error("Error updating credit points by email:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update your points.',
            });
            throw error; // Re-throw the error so your component can handle it
        }
    };

    const authInfo = {
        user,
        setUser,
        createNewUser,
        logOut,
        logIn,
        loading,
        updateP,
        googleSignIn,
        deleteAccount,
        updateUserCreditPoints   // Add the updateUserCreditPoints function to the context value
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
    return <AuthC.Provider value={authInfo}>{children}</AuthC.Provider>
};

export default AuthProviderx;