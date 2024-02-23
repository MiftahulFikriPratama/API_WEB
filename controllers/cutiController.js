const { connection } = require("../config/database");

const cuti = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const query = await conn.query(
      "SELECT pengajuan_cuti.id_pengajuan_cuti, pengajuan_cuti.kategori, user.nama, pengajuan_cuti.tanggal_mulai, pengajuan_cuti.tanggal_selesai FROM pengajuan_cuti LEFT JOIN user ON pengajuan_cuti.id_user = user.id_user"
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
      "SELECT pengajuan_cuti.id_pengajuan_cuti, pengajuan_cuti.kategori, user.nama, pengajuan_cuti.tanggal_mulai, pengajuan_cuti.tanggal_selesai, pengajuan_cuti.upload_bukti_cuti FROM pengajuan_cuti LEFT JOIN user ON pengajuan_cuti.id_user = user.id_user WHERE pengajuan_cuti.id_pengajuan_cuti = ?",
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

const terimatolakcuti = async function (req, res) {
  const conn = await connection.getConnection();
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new Error("status is required");
    }

    const testing = await conn.query(
      "UPDATE pengajuan_cuti SET status = ? where id_pengajuan_cuti = ?",
      [status, id]
    );

    return res.status(200).json({
      message: "Pengajuan cuti sedang di prosess",
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
    const { catatan } = req.body;

    if (!catatan) {
      throw new Error("catatan is required");
    }
    // console.log(id, catatan)
    // return

    const testing = await conn.query(
      "UPDATE pengajuan_cuti SET catatan = ?  where id_pengajuan_cuti = ?",
      [catatan, id]
    );

    return res.status(200).json({
      message: "Catatan berhasil di submit",
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
    const { status } = req.body;

    const query = await conn.query(
      "UPDATE pengajuan_cuti SET status = ? WHERE id_pengajuan_cuti = ?",
      [status, id]
    );

    if (status == "Diterima") {
      const updateCuti = conn.query(
        "SELECT * FROM pengajuan_cuti where id_pengajuan_cuti = ?",
        [id]
      );

      const userStok = conn.query("SELECT * user where id_user = ? ", [
        updateCuti[0].id_user,
      ]);

      const stokCuti = userStok[0].stok_cuti - updateCuti[0].cuti_terpakai;

      const userUpdateStok = conn.query(
        "UPDATE user SET stok_cuti = ? where id_user = ? ",
        [stokCuti, updateCuti[0].id_user]
      );

      return res.status(200).json({
        message: "Cuuuutiiiiii",
      });
    }

    return res.status(200).json({
      message: "GAJADIIII CUTIIII",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    conn.release();
  }
};

module.exports = {
  cuti,
  detail,
  terimatolakcuti,
  catatan,
  laporan,
};
