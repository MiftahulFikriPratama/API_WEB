const { connection } = require("../config/database");
const fs = require("fs-extra");
const moment = require("moment");
const path = require("path");

const reimburst = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const query = await conn.query(
      "SELECT reimbursment.id_reimbursment, reimbursment.tanggal_waktu, reimbursment.nominal_uang, reimbursment.kategori, reimbursment.status, user.nama FROM `reimbursment` LEFT JOIN user ON user.id_user = reimbursment.id_user"
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
      "SELECT reimbursment.id_reimbursment, reimbursment.tanggal_waktu, reimbursment.nominal_uang, reimbursment.kategori, reimbursment.keterangan, reimbursment.nama_bank, reimbursment.nomor_rekening, reimbursment.bukti_transaksi, user.nama FROM reimbursment LEFT JOIN user ON user.id_user = reimbursment.id_user where reimbursment.id_reimbursment = ?",
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

const terimatolak = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { id } = req.params;
    const { status, } = req.body;

    if (!status) {
      throw new Error("status is required");
    }

    const testing = await conn.query(
      "UPDATE reimbursment SET status = ? where id_reimbursment = ?",
      [status, id]
    );

    return res.status(200).json({
      message: "Pengajuan Reimburstment sedang di prosess",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const pengembalian = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const query = await conn.query(
      "SELECT reimbursment.id_reimbursment, user.nama, reimbursment.nominal_uang, reimbursment.status FROM reimbursment LEFT JOIN user ON reimbursment.id_user = user.id_user WHERE reimbursment.status = 'Diterima'"
    );

    return res.status(200).json(query[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

const detailpengembalian = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const unix = moment.unix(new Date());

    const { id } = req.params;
    const filePath = path.resolve(__dirname, "..", "public/reimburst");
    const file = req.files.bukti_reimburs; // ambil nama file dari inputan postman
    const bukti_reimburs_nama = "/upload" + unix + path.extname(file.name);
    const bukti_reimburs = filePath + bukti_reimburs_nama; // untuk merename file sesuai dengan kita agar lebih rapih

    if (!bukti_reimburs_nama) {
      throw new Error("bukti_reimburs_nama is required");
    }

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    file.mv(bukti_reimburs, async (err) => {
      if (err) throw { code: 400, message: "Failed upload file" };

      const testing = await conn.query(
        "UPDATE reimbursment set bukti_transaksi = ? where reimbursment.id_reimbursment = ? ",
        [bukti_reimburs_nama, id]
      );
    });

    return res.status(200).json({
      message: "Pengembalian dana lagi di prosess",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};


module.exports = {
  reimburst,
  detail,
  terimatolak,
  pengembalian,
  detailpengembalian,
  
};
