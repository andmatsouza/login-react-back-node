const { Router } = require("express");
const userController = require("../controllers/user");

const { eAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/uploadImgProfile");

const router = Router();

router.get("/api/users/:page", eAdmin, userController.getUsers);
router.get("/api/user/:id", eAdmin, userController.getUser);
router.post("/api/user", eAdmin, userController.AddUser);
router.put("/api/user", eAdmin, userController.setUser);
router.put("/api/user-senha", eAdmin, userController.setUserPassword);
router.delete("/api/user/:id", eAdmin, userController.deleteUser);
router.post("/api/login", userController.loginUser);
router.post("/api/add-user-login", userController.addLoginUser);
router.get("/api/val-token", eAdmin, userController.validateToken);
router.get("/api/view-profile", eAdmin, userController.getViewProfile);
router.put("/api/edit-profile", eAdmin, userController.setEditProfile);
router.put("/api/edit-profile-password", eAdmin, userController.setProfilePassword);
router.post("/api/recover-password", eAdmin, userController.recoverPassword);
router.get("/api/val-key-recover-pass/:key", eAdmin, userController.valKeyRecoverPassword);
router.put("/api/update-password/:key", userController.setRecoverUpdatePassword);
router.put("/api/edit-profile-image", eAdmin, upload.single("image"), userController.setEditProfileImage);
router.put("/api/edit-user-image/:id", eAdmin, upload.single("image"), userController.setEditUserImage);
   

module.exports = router;
