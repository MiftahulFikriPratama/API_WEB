const { connection } = require("../config/database");

const tabel = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const query = await conn.query(
      "SELECT id_user, nama, username, password, no_hp, email, tipe_role FROM user;"
    );

    return res.status(200).json(query[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const tambah = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { nama, username, password, no_hp, email, tipe_role } = req.body;
    if (!nama) {
      throw new Error("nama is required");
    }

    if (!username) {
      throw new Error("username is required");
    }

    if (!password) {
      throw new Error("password is required");
    }

    if (!no_hp) {
      throw new Error("no_hp is required");
    }

    if (!email) {
      throw new Error("email is required");
    }

    if (!tipe_role) {
      throw new Error("tipe_role is required");
    }
    const query = await conn.query(
      "INSERT INTO user (nama, username, password, no_hp, email, tipe_role) VALUES (?, ?, ?, ?, ?, ?)",
      [nama, username, password, no_hp, email, tipe_role]
    );

    return res.status(200).json({
      message: "User berhasil di tambahkan",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const profil = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { id } = req.params;
    const { username, password, email, no_hp  } = req.body;

    if (!username || !password || !email || !no_hp ) {
      throw new Error("Semua data diperlukan.");
    }

    const testing = await conn.query(
      "UPDATE user SET username = ?, password = ?, email = ?, no_hp = ?  where id_user = ?",
      [username, password, email, no_hp, id]
    );

    return res.status(200).json({
      message: "Profil  berhasil di update coy",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

module.exports = {
  tabel,
  tambah,
  profil,
};
