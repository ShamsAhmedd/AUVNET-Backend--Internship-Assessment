const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User,validateRegisterUser } = require("../../models/User");

// create new admin
const createAdmin = asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
    return res.status(400).json({ message: "This email is already registered" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
    return res.status(400).json({ message: "This username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
        username,
        email,
        password: hashedPassword,
        type: "admin",
    });

    await admin.save();

    const token = admin.generateToken();
    const { password: _, ...adminData } = admin._doc;

    res.status(201).json({
        message: "Admin created successfully",
        admin: adminData,
        token,
    });
});

// Get all admins
const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await User.find({ type: "admin" }).select("-password");
    res.status(200).json(admins);
});

// Update Admin
const updateAdmin = asyncHandler(async (req, res) => {
    const admin = await User.findById(req.params.id);

    if (!admin || admin.type !== "admin") {
        return res.status(404).json({ error: "Admin not found" });
    }

    delete req.body.type;

    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    Object.assign(admin, req.body);

    await admin.save();

    const token = admin.generateToken();
    const { password, ...adminData } = admin._doc;

    res.status(200).json({
        message: "Admin updated",
        admin: adminData,
        token,
    });
});

//delet admin
const deleteAdmin = asyncHandler(async (req, res) => {
    const admin = await User.findById(req.params.id);

    if (req.params.id === req.user._id) {
    return res.status(403).json({ message: "You can't delete yourself." });
    }

    if (!admin || admin.type !== "admin") {
        return res.status(404).json({ message: "Admin not found" });
    }

    await admin.deleteOne();
    res.status(200).json({ message: "Admin deleted" });
});

module.exports = {createAdmin,getAllAdmins,updateAdmin,deleteAdmin};