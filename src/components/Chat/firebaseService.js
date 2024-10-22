import { db } from '../../firebase'; // Import your Firebase config
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

// Fetch users excluding the current user
export const getUsers = async (currentUserId) => {
  const usersRef = collection(db, 'users');
  const userDocs = await getDocs(usersRef);
  const users = userDocs.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return users.filter(user => user.id !== currentUserId); // Exclude current user
};

// Send a message and update both sender and receiver chats
export const sendMessageToChat = async (newMessage, senderId, receiverId) => {
  const chatDocRef = doc(db, 'chats', `${senderId}_${receiverId}`);
  const receiverChatDocRef = doc(db, 'chats', `${receiverId}_${senderId}`);

  await setDoc(chatDocRef, {
    messages: arrayUnion(newMessage),
  }, { merge: true });

  await setDoc(receiverChatDocRef, {
    messages: arrayUnion(newMessage),
  }, { merge: true });
};

// Get chat history
export const getChatHistory = async (currentUserId, selectedUserId) => {
  const chatDocRef = doc(db, 'chats', `${currentUserId}_${selectedUserId}`);
  const chatDoc = await getDoc(chatDocRef);
  return chatDoc.exists() ? chatDoc.data().messages : [];
};

// Pin sender to receiver's pinned chat list
export const pinSenderToReceiverInFirestore = async (receiverId, senderId) => {
  const receiverDocRef = doc(db, 'users', receiverId);
  await updateDoc(receiverDocRef, {
    pinnedChats: arrayUnion(senderId),
  });
};
