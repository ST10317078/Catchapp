import { useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { useUserStore } from "../../store/useUserStore"; // Assuming you have a store for user data

const AddUser = () => {
  const [user, setUser] = useState(null);
  const [searchError, setSearchError] = useState("");
  const { currentUser } = useUserStore(); // Assuming currentUser is stored in your app's state

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    if (!username) {
      setSearchError("Please enter a username.");
      return;
    }

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
        setSearchError(""); // Clear any previous error
      } else {
        setSearchError("User not found.");
        setUser(null); // Clear previous search results
      }
    } catch (err) {
      console.error("Error searching for user:", err);
      setSearchError("An error occurred during the search.");
    }
  };

  const handleAdd = async () => {
    if (!user || !currentUser) return;

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef); // Create a new chat document

      // Create an empty chat document
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Update the other user's chat list
      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      // Update the current user's chat list
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

      setUser(null); // Clear the search result after adding the user
    } catch (err) {
      console.error("Error adding chat:", err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button type="submit">Search</button>
      </form>
      {searchError && <p className="error">{searchError}</p>}
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="User avatar" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
