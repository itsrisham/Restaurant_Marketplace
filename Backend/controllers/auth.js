const { v4: uuidv4 } = require("uuid");
const User = require("../models/auth");
const { setUser } = require("../service/auth");
const { set } = require("mongoose");

// Signup handler
async function handleUserSignup(req, resp) {
    const { name, email, username, password } = req.body;
    console.log(req.body); // Ensure username is coming in the request

    // Validate input
    if (!name || !email || !username || !password) {
        return resp.render("signup", { message: "All fields are required." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        return resp.render("signup", { message: "Username or Email already exists." });
    }

    // Create user
    await User.create({ name, email, username, password });

    // Redirect to login page
    return resp.redirect("/login");
}


// Login handler
async function handleUserLogin(req, resp) {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("Missing email or password.");
        return resp.render("login", { message: "All fields are required." });
    }

    // Search for the user by email
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) {
        console.log("Invalid email.");
        return resp.render("login", { message: "Invalid Email or Password." });
    }

    // Compare plain text password
    if (password !== user.password) {
        console.log("Invalid password.");
        return resp.render("login", { message: "Invalid Email or Password." });
    }

    // Generate token and set it in the cookie
    const token = setUser({ userId: user._id, username: user.username });
    console.log("Generated token:", token);

    resp.cookie("token", token, { httpOnly: true });
    console.log("Token set in cookie.");

    return resp.redirect("/home");
}


// Change Password handler
async function redirecttochangepassword(req, resp) {
    return resp.render('change-password');
}

async function changepassword(req, resp) {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return resp.render('change-password', { message: 'All fields are required.' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { password: newPassword },
            { new: true }
        );

        if (!updatedUser) {
            return resp.render('change-password', { message: 'User not found.' });
        }

        return resp.redirect('/login.html');
    } catch (error) {
        return resp.render('change-password', { message: "An error occurred.", error });
    }
}

// Delete Account handler
async function redirecttodelete(req, resp) {
    return resp.render('delete-account');
}

async function deleteaccount(req, resp) {
    try {
        const { email } = req.body;

        if (!email) {
            return resp.render('delete-account', { message: 'Username is required.' });
        }

        const result = await User.findOneAndDelete({ email });

        if (!result) {
            return resp.render('delete-account', { message: 'User not found.' });
        }

        return resp.redirect('/login?message=Account%20deleted%20successfully!');
    } catch (error) {
        return resp.render('delete-account', { message: 'An error occurred.', error });
    }
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    changepassword,
    redirecttochangepassword,
    redirecttodelete,
    deleteaccount,
};
