import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      message: "User registered",
      user
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);

    res.json({
      message: "Login successful",
      token,
      user
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};