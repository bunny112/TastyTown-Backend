import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";
import { protect, isAdmin } from "../middleware/auth.js";

const router = express.Router();

 


router.post("/create-admin", protect, isAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const role = req.body.role === "admin" ? "admin" : "user";

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        
      
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    res.status(201).json({
      message: "Registered successfully. Verify OTP",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



/* =================  GET OWN PROFILE ================= */

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});


/* =================  update user profile ================= */

router.put("/users/:id", protect, isAdmin, async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// /users route
router.get("/users", protect, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users); 
});




/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;
