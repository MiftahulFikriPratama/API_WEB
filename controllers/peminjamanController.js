const { connection } = require("../config/database");

const pinjam = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const query = await conn.query(
      "SELECT pinjam_barang.id_pinjam_barang, user.nama, barang.nama_barang, pinjam_barang.tanggal_pinjam, pengajuan_barang.status FROM pinjam_barang LEFT JOIN user ON pinjam_barang.id_user = user.id_user LEFT JOIN barang ON pinjam_barang.id_user = barang.id_user LEFT JOIN pengajuan_barang ON pinjam_barang.id_user = pengajuan_barang.id_user"
    );

    res.status(200).json(query[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const detailpinjam = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { id } = req.params;
    const query = await conn.query(
      "SELECT pinjam_barang.id_pinjam_barang, user.nama, barang.nama_barang, pinjam_barang.jumlah_barang, pinjam_barang.tanggal_pinjam, pengajuan_barang.keterangan FROM pinjam_barang LEFT JOIN user ON pinjam_barang.id_user = user.id_user LEFT JOIN barang ON pinjam_barang.id_user = barang.id_user LEFT JOIN pengajuan_barang ON pinjam_barang.id_user = pengajuan_barang.id_user where pinjam_barang.id_pinjam_barang = ?",
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

const terimatolakpinjam = async function (req, res) {
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
      message: "Pinjam barang sedang di prosess",
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
    const query = await conn.query(
      "SELECT pinjam_barang.id_pinjam_barang, user.nama, barang.nama_barang, pinjam_barang.tanggal_pinjam FROM pinjam_barang LEFT JOIN user ON pinjam_barang.id_user = user.id_user LEFT JOIN barang ON pinjam_barang.id_user = barang.id_user"
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
  pinjam,
  terimatolakpinjam,
  detailpinjam,
  laporan,
};
