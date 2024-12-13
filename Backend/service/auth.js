const jwt=require("jsonwebtoken");
const secret="Risham$123@$";

function setUser(user){
    const payload={
        ...user
    };
    return jwt.sign(payload,secret);
}

function getUser(token) {
    try {
      const decoded = jwt.verify(token, secret); 
  
      if (!decoded.userId) {
        throw new Error("Missing userId in token payload");
      }
  
  
      return decoded; 
    } catch (err) {
      throw new Error("Invalid or expired token: " + err.message);
    }
  }

module.exports={
    setUser,getUser
}