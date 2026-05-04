import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "./auth.service.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await loginUser(req.body);

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// REFRESH
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const data = await refreshAccessToken(refreshToken);

    res.json(data);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    await logoutUser(req.user.userId);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};