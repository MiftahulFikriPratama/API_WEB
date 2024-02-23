// controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { connection } = require("../config/database");
const { secretKey } = require("../config/jwtSecret");

async function login(req, res) {
  const { username, password } = req.body;
  const conn = await connection.getConnection();

  try {
    const [rows, fields] = await conn.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (rows.length > 0) {
      // const match = await bcrypt.compare(password, rows[0].password);
      const match = password == rows[0].password;
      console.log(match);

      if (match) {
        const token = jwt.sign(
          { id_user: rows[0].id_user, username: rows[0].username },
          secretKey,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({ message: "Login successful", token });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function register(req, res) {
  const { username, password, role } = req.body;
  const conn = await connection.getConnection();

  try {
    // Check if user already exists
    const [existingUser] = await  conn.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    await conn.query("INSERT INTO user (username, password, id_role) VALUES (?, ?, ?)", [
      username,
      hashedPassword,
      role,
    ]);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function test(req, res) {
  try {
    return res.status(200).json({ message: "validasinya lulus nibrooo" });
  } catch (error) {
    return res.status(500).json({ message: "error nih" });
  }
}

module.exports = { login, register, test };
