import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

export const uploadProfileImage = async (userId, file) => {
  const imageRef = ref(storage, `profileImages/${userId}/${file.name}`);

  await uploadBytes(imageRef, file);

  const downloadURL = await getDownloadURL(imageRef);

  return downloadURL;
};
