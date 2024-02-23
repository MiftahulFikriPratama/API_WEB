const { connection } = require("../config/database");

const role = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const query = await conn.query("SELECT * FROM role");
    const data = query[0];
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const insert = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { ir, tr } = req.body;
    const testing = await conn.query(
      "INSERT INTO role (id_role, tipe_role) VALUES (?, ?)",
      [ir, tr]
    );
    return res.status(200).json("Data User Successfully Inserted");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const update = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { ir, tr } = req.body;
    const { id } = req.params;
    const testing = await conn.query(
      "UPDATE role SET id_role = ?, tipe_role = ? WHERE id_role = ?",
      [ir, tr, id]
    );

    return res.status(200).json("Data User Successfully Updated");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const deleteDate = async function (req, res) {
  const conn = await connection.getConnection();
  const { id } = req.params;
  try {
    const testing = await conn.query("DELETE FROM role WHERE id_role = ?;", [
      id,
    ]);
    return res.status(200).json("User Successfully Deleted");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

module.exports = {
  role,
  insert,
  update,
  deleteDate,
};
