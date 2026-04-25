import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No authentication token, authorization denied." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the token payload has 'id' or 'userId' depending on how it was signed.
    // In token.js it was signed as { id: userId }
    req.userId = decoded.id || decoded.userId;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    res.status(401).json({ message: "Token verification failed." });
  }
};

export default isAuth;