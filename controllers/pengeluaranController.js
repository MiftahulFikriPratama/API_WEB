const { connection } = require("../config/database");
const fs = require("fs-extra");
const moment = require("moment");
const path = require("path");

const pengeluaran = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const unix = moment.unix(new Date());

    const {
      nama_pengirim,
      nama_penerima,
      nominal_pengeluaran,
      tanggal,
      keterangan,
    } = req.body;
    const { id_user } = req.user;
    const filePath = path.resolve(__dirname, "..", "public/pengeluaran");
    const file = req.files.upload_bukti; // ambil nama file dari inputan postman
    const upload_bukti_nama = "/upload" + unix + path.extname(file.name);
    const upload_bukti = filePath + upload_bukti_nama; // untuk merename file sesuai dengan kita agar lebih rapih

    if (!nama_pengirim) {
      throw new Error("nama_pengirim is required");
    }

    if (!nama_penerima) {
      throw new Error("nama_penerima is required");
    }

    if (!nominal_pengeluaran) {
      throw new Error("nominal_pengeluaran is required");
    }

    if (!tanggal) {
      throw new Error("tanggal is required");
    }

    if (!tanggal) {
      throw new Error("tanggal is required");
    }

    if (!keterangan) {
      throw new Error("keterangan is required");
    }

    if (!upload_bukti_nama) {
      throw new Error("upload_bukti_nama is required");
    }

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    file.mv(upload_bukti, async (err) => {
      if (err) throw { code: 400, message: "Failed upload file" };

      const testing = await conn.query(
        "INSERT INTO kas_keluar (id_user, nama_pengirim, nama_penerima, nominal_dikeluarkan, tanggal_waktu, keterangan, bukti_transaksi) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          id_user,
          nama_pengirim,
          nama_penerima,
          nominal_pengeluaran,
          tanggal,
          keterangan,
          upload_bukti_nama,
        ]
      );
    });

    return res.status(200).json({
      message: "Pengeluaran lagi di proses",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const laporanpengeluaran = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const query = await conn.query(
      "SELECT id_kas_keluar, nama_pengirim, nama_penerima, tanggal_waktu, bukti_transaksi FROM kas_keluar"
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
      "SELECT id_kas_keluar, nama_penerima, nama_pengirim, tanggal_waktu, nominal_dikeluarkan, keterangan, bukti_transaksi FROM kas_keluar where id_kas_keluar = ?",
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
  pengeluaran,
  laporanpengeluaran,
  detail,
};
