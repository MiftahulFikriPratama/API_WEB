const { connection } = require("../config/database");

const inventory = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const query = await conn.query(
      "SELECT barang.id_barang, barang.nama_barang, barang.kategori, barang.jumlah_barang FROM barang"
    );

    return res.status(200).json(query[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const detail = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { id } = req.params;
    const query = await conn.query(
      "SELECT barang.id_barang, barang.jumlah_barang, barang.detail FROM barang LEFT JOIN user ON user.id_user = barang.id_user where barang.id_barang = ?",
      [id]
    );

    return res.status(200).json(query[0][0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const tambahstok = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { nama_barang, kategori, jumlah_barang, detail } = req.body;
    const { id_user } = req.user;

    if (!nama_barang) {
      throw new Error("nama_barang is required");
    }

    if (!kategori) {
      throw new Error("kategori is required");
    }

    if (!jumlah_barang) {
      throw new Error("jumlah_barang is required");
    }

    if (!detail) {
      throw new Error("detail is required");
    }

    const testing = await conn.query(
      "INSERT INTO barang (id_user, nama_barang, kategori, jumlah_barang, detail) VALUES (?, ?, ?, ?, ?)",
      [id_user, nama_barang, kategori, jumlah_barang, detail]
    );

    return res.status(200).json({
      message: "berhasil di tambahkan cuy",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const updatebarang = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { id } = req.params;
    const { jumlah_barang, status } = req.body;
    if (!jumlah_barang) {
      throw new Error("jumlah_barang is required");
    }

    if (!status) {
      throw new Error("status is required");
    }

    const testing = await conn.query(
      "UPDATE barang SET jumlah_barang = ?, status = ? WHERE id_barang = ?",
      [jumlah_barang, status, id]
    );

    return res.status(200).json({
      message: "berhasil di update cuy",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const laporan = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { id } = req.params;
    const query = await conn.query(
      "SELECT barang.id_barang, barang.nama_barang, barang.status, barang.detail FROM barang LEFT JOIN user ON user.id_user = barang.id_user where barang.id_barang = ?",
      [id]
    );

    return res.status(200).json(query[0][0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

module.exports = {
  inventory,
  detail,
  tambahstok,
  updatebarang,
  laporan,
};
