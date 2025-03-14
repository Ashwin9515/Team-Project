import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("https://expert-yodel-qrpx5wx46q4cx745-5000.app.github.dev/api/profiles");
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

  if (profiles.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Student Details</h2>
      {profiles.map((profile) => (
        <div key={profile._id}>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Profile;
