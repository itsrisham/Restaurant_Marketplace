const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const { protectStaticFiles } = require("./Backend/middlewares/auth");
const {
  handleUserSignup,
  handleUserLogin,
  changepassword,
  redirecttochangepassword,
  redirecttodelete,
  deleteaccount,
} = require("./Backend/controllers/auth");
const { connectToMongoDB } = require("./Backend/connect");
const User = require("./Backend/models/auth");
const PORT = 5000;
const app = express();
const fs = require("fs");
const jwt = require("jsonwebtoken");

const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// async function uploadFile(file, userId) {
//   const fileName = `${userId}_${file.originalname}`;
//   const filePath = path.join(__dirname, "public/uploads", fileName);

//   try {
//     fs.renameSync(file.path, filePath); 
//     return { fileName }; 
//   } catch (err) {
//     console.error("Error renaming file:", err.message);
//     throw new Error("File upload failed");
//   }
// }





connectToMongoDB("mongodb://127.0.0.1:27017/food-delivery").then(() =>
  console.log("MongoDB Connected")
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }
    cb(null, true);
  },
});



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Backend/views"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads"))); 


app.use(express.static(path.join(__dirname, "public")));

app.post("/signup", handleUserSignup);
app.post("/login", handleUserLogin);
app.get("/change-password", redirecttochangepassword);
app.post("/change-password", changepassword);
app.get("/delete-account", redirecttodelete);
app.post("/delete-account", deleteaccount);
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.use(protectStaticFiles);

function verifyToken(token) {
  if (!token) {
    throw new Error("Token missing");
  }

  try {
    const decoded = jwt.verify(token, "Risham$123@$");
    console.log("Decoded user:", decoded);
    return decoded;
  } catch (err) {
    console.error("Error during token verification:", err.message);
    throw new Error("Invalid or expired token");
  }
}



app.post("/upload", upload.single("profilePic"), async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token is missing" });
  }

  try {
    const user = verifyToken(token);
    const userId = user.userId;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // const uploadedFile = await uploadFile(req.file, userId);
    // const fileName = uploadedFile.fileName; // Save the fileName

    await User.findByIdAndUpdate(userId, { profilePic: req.file.filename });

    res.redirect(`/home`);
  } catch (err) {
    console.error("Error during file upload:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});




// Signup and Login Routes
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true });
  res.redirect("/login");
});

app.get("/home", async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect("/login"); // Redirect if the user is not authenticated
  }

  try {
    const decoded = verifyToken(token);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.redirect("/login");
    }

    const profilePicFromQuery = req.query.profilePic || user.profilePic;
    const profilePicUrl = profilePicFromQuery
      ? `/uploads/${profilePicFromQuery}`
      : "/path/to/default/profile-pic.png"; 

    res.render("Home", { 
      username: user.name, 
      profilePic: profilePicUrl,  
      success: null,
      error: null 
    });
  } catch (err) {
    console.error("Error loading home page:", err.message);
    res.redirect("/login");
  }
});



app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
              