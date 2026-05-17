import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const createIncidentReport = async (currentUser, reportData) => {
  if (!currentUser) {
    throw new Error("User not authenticated");
  }

  const incidentData = {
    userId: currentUser.uid,
    userEmail: currentUser.email,

    title: reportData.title,
    description: reportData.description,
    category: reportData.category,
    threatLevel: reportData.threatLevel,
    location: reportData.location,

    // Used in CommunityFeed.jsx
    incidentType: reportData.incidentType || reportData.category,
    severity: reportData.severity || reportData.threatLevel,

    // Required for nearby danger detection
    latitude: Number(reportData.latitude),
    longitude: Number(reportData.longitude),

    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "incidentReports"), incidentData);
};
