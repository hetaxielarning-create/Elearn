import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, changePassword } from "../services/api";
import { getErrorMessage } from "../utils/helpers";
import "../styles/Login.css";

export default function Profile() {
  const { user, refreshUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError("");
    setProfileMsg("");
    setSavingProfile(true);
    try {
      const res = await updateProfile(profileForm);
      refreshUser?.(res.data);
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordMsg("");

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg("Password changed successfully.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      setPasswordError(getErrorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="container">
      <h1>My Profile</h1>

      <div className="auth-form" style={{ margin: "20px 0" }}>
        <h2>Update Details</h2>
        {profileMsg && <p style={{ color: "#27ae60" }}>{profileMsg}</p>}
        {profileError && <p className="form-error">{profileError}</p>}

        <form onSubmit={handleProfileSubmit}>
          <label>Full Name</label>
          <input
            value={profileForm.name}
            onChange={(e) =>
              setProfileForm({ ...profileForm, name: e.target.value })
            }
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={profileForm.email}
            onChange={(e) =>
              setProfileForm({ ...profileForm, email: e.target.value })
            }
            required
          />

          <button className="btn btn-primary" type="submit" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="auth-form" style={{ margin: "20px 0" }}>
        <h2>Change Password</h2>
        {passwordMsg && <p style={{ color: "#27ae60" }}>{passwordMsg}</p>}
        {passwordError && <p className="form-error">{passwordError}</p>}

        <form onSubmit={handlePasswordSubmit}>
          <label>Current Password</label>
          <input
            type="password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
            required
          />

          <label>New Password</label>
          <input
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            required
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={passwordForm.confirmNewPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmNewPassword: e.target.value,
              })
            }
            required
          />

          <button
            className="btn btn-primary"
            type="submit"
            disabled={savingPassword}
          >
            {savingPassword ? "Saving..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
