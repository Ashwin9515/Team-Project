import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null); // State to store profile data

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("https://fuzzy-fiesta-4jjprrwwwxqq25g76-5000.app.github.dev/api/profiles"); // Backend API to fetch profile
        setProfile(response.data); // Update state with fetched profile data
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile(); // Fetch profile data on component mount
  }, []);

  if (!profile) {
    return <div>Loading...</div>; // Display loading message while data is being fetched
  }

  return (
    <div className="profile-container">
      <h2>Student Details</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Role:</strong> {profile.role}</p>
    </div>
  );
};

export default Profile;
