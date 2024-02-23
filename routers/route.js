const express = require("express");

const roleController = require("../controllers/role_controllers");
const pemasukanController = require("../controllers/pemasukanController");
const pengeluaranController = require("../controllers/pengeluaranController");
const reimburstController = require("../controllers/reimburstController");
const pengadaaninventoryControlle = require("../controllers/pengadaaninventoryController");
const peminjamanController = require("../controllers/peminjamanController");
const pengajuanController = require("../controllers/pengajuanController");
const serahterimaController = require("../controllers/serahterimaController");
const cutiController = require("../controllers/cutiController");
const usermenagementController = require("../controllers/usermenagementController");

const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

//REGISTER LOGIN TEST
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/test", authenticateToken, authController.test);
// //END POINT UROLE
// router.get("/roles", roleController.role);
// router.post("/roles", roleController.insert);
// router.put("/roles/:id", roleController.update);
// router.delete("/roles/:id", roleController.deleteDate);
//PEMASUKAN
router.post("/kasmas", authenticateToken, pemasukanController.pemasukan);
router.get("/laporanpemasukan", pemasukanController.laporanpemasukan);
router.get("/detailpemasukan/:id", pemasukanController.detail);
//PENGELUARAN
router.post("/kasKeluar", authenticateToken, pengeluaranController.pengeluaran);
router.get("/laporanpengeluaran", pengeluaranController.laporanpengeluaran);
router.get("/detail/laporanpengeluaran/:id", pengeluaranController.detail);
//REIMBURSMENT
router.get("/reimburs", reimburstController.reimburst);
router.get("/reimburs/detail/:id", reimburstController.detail);
router.put("/terimatolak/reimburst/:id", reimburstController.terimatolak);
router.get("/reimbursmen/pengembalian/dana", reimburstController.pengembalian);
router.put("/reimburs/pengembaliandana/:id", reimburstController.detailpengembalian);
//PENGADAAN INVENTORY
router.get("/datainventory", pengadaaninventoryControlle.inventory);
router.get("/detail/inventory/:id", pengadaaninventoryControlle.detail);
router.post("/tambahstokbarang", authenticateToken, pengadaaninventoryControlle.tambahstok);
router.put("/updatebarang/:id", pengadaaninventoryControlle.updatebarang);
router.get("/laporan/inventory/:id", pengadaaninventoryControlle.laporan);
//PEMINJAMAN
router.get("/pinjambarang", peminjamanController.pinjam);
router.get("/detailpinjam/:id", peminjamanController.detailpinjam);
router.put("/terimatolak/pinjam/:id", peminjamanController.terimatolakpinjam)
router.get("/laporan/peminjaman", peminjamanController.laporan);
//PENGAJUAN BARANG
router.get("/pengajuanbarang", pengajuanController.pengajuan);
router.get("/detailpengajuan/:id", pengajuanController.detailpengajuan);
router.put("/terimatolak/pengajuan/:id", pengajuanController.terimatolakpengajuan);
router.put("/catatan/:id", pengajuanController.catatan);
router.get("/laporan/pengajuan", pengajuanController.laporan);
//SERAH TERIMA
router.get("/serahterima/barang", serahterimaController.serahterima);
router.get("/detail/serahterima/:id", serahterimaController.detail);
router.put("/upload/bukti/serahterima/:id", serahterimaController.uploadbukti);
router.get("/laporan/penyerahan", serahterimaController.laporan);
//PENGAJUAN CUTI
router.get("/data/cuti", cutiController.cuti);
router.get("/detail/data/cuti/:id", cutiController.detail);
router.put("/terimatolak/cuti/:id", cutiController.terimatolakcuti)
router.put("/catatan/cuti/:id", cutiController.catatan);
router.get("/laporan/cuti", cutiController.laporan);
//USER MENAGEMENT
router.get("/tabel/user", usermenagementController.tabel);
router.post("/tambah/user", usermenagementController.tambah);
router.put("/update/profil/:id", usermenagementController.profil)

module.exports = router;
