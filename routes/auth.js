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
/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneNumber, adminKey } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = (adminKey === "ADMIN@123") ? "admin" : "user";
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role
    });


    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      message: "Registered successfully",
      user: userWithoutPassword
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: err.message });
  }
});


/* =================  GET OWN PROFILE ================= */

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});


/* ================= UPDATE USER (ADMIN) ================= */
router.put("/users/:id", protect, isAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    
    await user.save();
    
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/* ================= GET ALL USERS (ADMIN) ================= */
router.get("/users", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
