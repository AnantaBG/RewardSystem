/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, deleteUser, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import app from "../Auth/Firebase/firebase.init";
import Swal from 'sweetalert2'; // Import SweetAlert2

export const AuthC = createContext();
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();


const AuthProviderx = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const updateUserCreditPoints = async (uid, newPoints) => {
    // Your implementation to update credit points (e.g., API call)
    console.log(`Updating user ${uid} points to ${newPoints}`); // Placeholder
    try {
      //  Replace with your actual API call
      // await fetch(`/api/users/${uid}`, { ... });
      // Here, you would typically make a PATCH or PUT request to your backend
      // to update the user's credit points in the database.
      // For this example, I'll just simulate a successful update:

      // Simulate updating the user data:  Important:  You MUST update the user object.
      setUser(prevUser => {
        if (prevUser?.uid === uid) {
          return { ...prevUser, creditPoints: newPoints };
        }
        return prevUser; //important
      });

    } catch (error) {
      console.error("Error updating credit points:", error);
      throw error; // Re-throw to be caught in AllTasks
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
    updateUserCreditPoints  // Add the updateUserCreditPoints function to the context value
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
