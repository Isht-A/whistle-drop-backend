module.exports = function requireModeratorAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const expectedSecret = process.env.JWT_SECRET || "supersecretwhistlekey";

  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      message: "Missing authorization header"
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (token !== expectedSecret) {
    return res.status(403).json({
      ok: false,
      message: "Invalid moderator token"
    });
  }

  next();
};