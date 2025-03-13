import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Paper, Grid } from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = 'johndoe@example.com'; // Replace with dynamic email from auth context
        const response = await axios.get('/api/profile', { params: { email } });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile({
          name: 'New User',
          email: 'johndoe@example.com',
          role: 'Student'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/profile', profile);
      setProfile(response.data.profile);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <Typography variant="body1">Loading profile...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: '2rem auto' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {editMode ? 'Edit Profile' : 'Student Details'}
      </Typography>

      {editMode ? (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                required
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role"
                name="role"
                select
                SelectProps={{ native: true }}
                value={profile.role}
                onChange={handleInputChange}
                required
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Admin">Admin</option>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ mr: 2 }}
              >
                Save Changes
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      ) : (
        <>
          <Typography variant="body1" paragraph>
            <strong>Name:</strong> {profile.name}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Email:</strong> {profile.email}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Role:</strong> {profile.role}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </Button>
        </>
      )}
    </Paper>
  );
};

export default Profile;
