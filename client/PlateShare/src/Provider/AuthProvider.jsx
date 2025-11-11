import React, { useEffect, useState } from "react";
import app from "../FireBase/firebase.config";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  signOut,
} from "firebase/auth";
import { AuthContext } from "./AuthContext";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = async (name, photoURL, email, password) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (name || photoURL) {
      await updateProfile(res.user, {
        displayName: name || "",
        photoURL: photoURL || "",
      });
    }
    return res;
  };

  const updateUserProfile = (data) => {
    if (!auth.currentUser) return Promise.reject(new Error("No user"));
    return updateProfile(auth.currentUser, data);
  };

  const login = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = {
    user,
    loading,
    createUser,
    updateUserProfile,
    login,
    loginWithGoogle,
    logout,
    setLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
