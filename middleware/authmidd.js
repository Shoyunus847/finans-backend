import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }

    const parts = header.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = parts[1];

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token",
      error: err.message
    });
  }
};

export default auth;