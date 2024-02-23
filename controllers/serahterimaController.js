const { connection } = require("../config/database");
const fs = require("fs-extra");
const moment = require("moment");
const path = require("path");

const serahterima = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const query = await conn.query(
      "SELECT barang.id_barang, pengajuan_barang.nama_barang, user.nama, pengajuan_barang.status FROM barang LEFT JOIN user ON barang.id_user = user.id_user LEFT JOIN pengajuan_barang ON barang.id_user = pengajuan_barang.id_user WHERE pengajuan_barang.status = 'Diterima'"
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
      "SELECT user.nama, pengajuan_barang.id_ajukan_barang, pengajuan_barang.nama_barang, pengajuan_barang.created_at, pengajuan_barang.jumlah_barang, pengajuan_barang.harga_satuan, pengajuan_barang.harga_total, pengajuan_barang.keterangan FROM pengajuan_barang LEFT JOIN user ON pengajuan_barang.id_user = user.id_user where pengajuan_barang.id_ajukan_barang = ?",
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

const uploadbukti = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const unix = moment.unix(new Date());

    const { id } = req.params;
    //   console.log(req.body)
    //   return
    const filePath = path.resolve(__dirname, "..", "public/serahterima");
    const file = req.files.uploadbukti; // ambil nama file dari inputan postman
    const bukti_serahterima = "/upload" + unix + path.extname(file.name);
    const uploadbukti = filePath + bukti_serahterima; // untuk merename file sesuai dengan kita agar lebih rapih

    if (!bukti_serahterima) {
      throw new Error("bukti_serahterima is required");
    }

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    file.mv(uploadbukti, async (err) => {
      // console.log('ini err nya : ', err)
      if (err) throw { code: 400, message: "Failed upload file" };
      const testing = await conn.query(
        "UPDATE pengajuan_barang set bukti_serah_terima = ? where id_ajukan_barang = ? ",
        [bukti_serahterima, id]
      );
    });

    return res.status(200).json({
      message: "bukti serah terima berhasil di kirim",
    });
  } catch (err) {
    console.log("ini err nya : ", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const laporan = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const query = await conn.query(
      "SELECT pengajuan_barang.id_ajukan_barang, user.nama, pengajuan_barang.nama_penyerah, pengajuan_barang.update_at, pengajuan_barang.bukti_serah_terima FROM pengajuan_barang LEFT JOIN user ON pengajuan_barang.id_user = user.id_user"
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
  serahterima,
  detail,
  uploadbukti,
  laporan,
};