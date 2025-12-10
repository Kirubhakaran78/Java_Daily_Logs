import axios from "axios";
import { useUser } from "../context/UserProvider";

export default function ProfilePicUploader() {
  const { user, updateUser } = useUser();

  const uploadProfilePic = async (file) => {
    if (!user?.id) {
      alert("No user ID found!");
      return;
    }

    // Step 1 → Confirmation popup
    if (!window.confirm("Do you want to change your profile picture?")) return;

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await axios.post(
        `http://localhost:8082/Org_Management_java/api/masters/${user.id}/upload-profile`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const imageUrl = res.data; // backend returns plain string

      // Step 2 → Update global context (NO REFRESH)
      updateUser({
        ...user,
        profilePic: imageUrl,
      });

      alert("Profile picture updated successfully!");
    } catch (err) {
      alert("Upload failed!");
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    if (!e.target.files[0]) return;
    uploadProfilePic(e.target.files[0]);
  };

  return <input type="file" accept="image/*" onChange={handleFileChange} />;
}
