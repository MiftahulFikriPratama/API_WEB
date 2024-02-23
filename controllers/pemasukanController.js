const { connection } = require("../config/database");
const fs = require("fs-extra");
const moment = require("moment");
const path = require("path");

const pemasukan = async function (req, res) {
  try {
    const conn = await connection.getConnection();
    const unix = moment.unix(new Date());

    const {
      pic_pengirim,
      pic_penerima,
      nominal_pemasukan,
      tanggal,
      keterangan,
    } = req.body;
    const { id_user } = req.user;
    const filePath = path.resolve(__dirname, "..", "public/pemasukan");
    const file = req.files.upload_bukti; // ambil nama file dari inputan postman
    const upload_bukti_nama = "/upload" + unix + path.extname(file.name);
    const upload_bukti = filePath + upload_bukti_nama; // untuk merename file sesuai dengan kita agar lebih rapih

    if (!pic_pengirim) {
      throw new Error("pic_pengirim is required");
    }

    if (!pic_penerima) {
      throw new Error("pic_penerima is required");
    }

    if (!nominal_pemasukan) {
      throw new Error("nominal_pemasukan is required");
    }

    if (!tanggal) {
      throw new Error("tanggal is required");
    }

    if (!keterangan) {
      throw new Error("keterangan is required");
    }

    if (!upload_bukti) {
      throw new Error("upload_bukti is required");
    }

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    file.mv(upload_bukti, async (err) => {
      if (err) throw { code: 400, message: "Failed upload file" };

      const testing = await conn.query(
        "INSERT INTO kas_masuk (id_user, nama_pengirim, nama_penerima, nominal_dikirim, tanggal_waktu, keterangan, bukti_transaksi) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          id_user,
          pic_pengirim,
          pic_penerima,
          nominal_pemasukan,
          tanggal,
          keterangan,
          upload_bukti_nama,
        ]
      );
    });

    return res.status(200).json({
      message: "Pemasukan lagi di proses",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

const laporanpemasukan = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const query = await conn.query(
      "SELECT kas_masuk.id_kas_masuk ,kas_masuk.nama_pengirim, kas_masuk.nama_penerima, kas_masuk.tanggal_waktu, kas_masuk.bukti_transaksi FROM kas_masuk"
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
      "SELECT kas_masuk.id_kas_masuk, kas_masuk.nama_pengirim, kas_masuk.nama_penerima, kas_masuk.tanggal_waktu, kas_masuk.nominal_dikirim, kas_masuk.keterangan, kas_masuk.bukti_transaksi FROM kas_masuk where kas_masuk.id_kas_masuk = ?",
      [id]
    );

    return res.status(200).json(query[0][0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

module.exports = {
  pemasukan,
  laporanpemasukan,
  detail,
};
