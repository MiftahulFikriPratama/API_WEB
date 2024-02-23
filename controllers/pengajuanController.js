const { connection } = require("../config/database");

const pengajuan = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const query = await conn.query(
      "SELECT pengajuan_barang.id_ajukan_barang, pengajuan_barang.created_at, pengajuan_barang.nama_barang, user.nama, pengajuan_barang.status FROM pengajuan_barang LEFT JOIN user ON pengajuan_barang.id_user = user.id_user"
    );

    return res.status(200).json(query[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const detailpengajuan = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { id } = req.params;
    const query = await conn.query(
      "SELECT pengajuan_barang.id_ajukan_barang, user.nama, pengajuan_barang.nama_barang, pengajuan_barang.created_at, pengajuan_barang.jumlah_barang, pengajuan_barang.harga_satuan, pengajuan_barang.harga_total, pengajuan_barang.keterangan FROM pengajuan_barang LEFT JOIN user ON pengajuan_barang.id_user = user.id_user where pengajuan_barang.id_ajukan_barang = ?",
      [id]
    );

    return res.status(200).json(query[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const terimatolakpengajuan = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { id } = req.params;
    const { status, } = req.body;

    if (!status) {
      throw new Error("status is required");
    }

    const testing = await conn.query(
      "UPDATE pengajuan_barang SET status = ? where id_ajukan_barang = ?",
      [status, id]
    );

    return res.status(200).json({
      message: "Pengajuan barang sedang di prosess",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};


const catatan = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { id } = req.params;

    // Periksa apakah catatan disertakan dalam request
    if (!req.body.catatan) {
      throw new Error("catatan is required");
    }

    const { catatan } = req.body;
    const testing = await conn.query(
      "UPDATE pengajuan_barang SET catatan = ? WHERE id_ajukan_barang = ?",
      [catatan, id]
    );

    return res.status(200).json({
      message: "Data berhasil diperbarui.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const laporan = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { id } = req.params;
    const query = await conn.query(
      "SELECT user.nama, pengajuan_barang.id_ajukan_barang, pengajuan_barang.created_at, pengajuan_barang.nama_barang, pengajuan_barang.harga_total FROM pengajuan_barang LEFT JOIN user ON pengajuan_barang.id_user = user.id_user",
      [id]
    );

    return res.status(200).json(query[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

module.exports = {
  pengajuan,
  detailpengajuan,
  terimatolakpengajuan,
  catatan,
  laporan,
};
