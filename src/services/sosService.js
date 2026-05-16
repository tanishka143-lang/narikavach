import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

// CREATE SOS ALERT
export const createSosAlert = async (user, location) => {
  const sosData = {
    userId: user.uid,
    email: user.email,
    latitude: location.latitude,
    longitude: location.longitude,
    status: "ACTIVE",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "sosAlerts"), sosData);

  return docRef.id;
};

// GET USER SOS ALERTS
export const getUserSosAlerts = async (userId) => {
  const q = query(collection(db, "sosAlerts"), where("userId", "==", userId));

  const querySnapshot = await getDocs(q);

  const alerts = [];

  querySnapshot.forEach((doc) => {
    alerts.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return alerts;
};
