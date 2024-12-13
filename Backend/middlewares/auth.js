const { getUser } = require("../service/auth");

function protectStaticFiles(req, res, next) {
    const token = req.cookies?.token;
  
    if (req.url === "/login") {
      return next(); 
    }
  
    if (!token) {
      return res.redirect("/login");
    }
  
    try {
      const user = getUser(token); 
      req.user = user; 
      next(); 
    } catch (err) {
      return res.redirect("/login"); 
    }
  }

module.exports = {protectStaticFiles};
