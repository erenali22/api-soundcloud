// backend/config/index.js
module.exports = {
  environment: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8000,
  dbFile: process.env.DB_FILE || './sqlite-db',
  jwtConfig: {
    secret: process.env.JWT_SECRET || 'my secret',
    expiresIn: process.env.JWT_EXPIRES_IN || 648000,
  },
};
