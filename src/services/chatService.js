import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

export const saveChatMessage = async (userId, message) => {
  await addDoc(collection(db, "aiChats"), {
    userId,
    sender: message.sender,
    text: message.text,
    createdAt: new Date(),
  });
};

export const getChatMessages = async (userId) => {
  const q = query(collection(db, "aiChats"), where("userId", "==", userId));

  const querySnapshot = await getDocs(q);

  const messages = [];

  querySnapshot.forEach((doc) => {
    messages.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return messages;
};
