const { Router } = require("express");
const userController = require("../controllers/user");

const { eAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/uploadImgProfile");

const router = Router();

router.get("/users/:page", eAdmin, userController.getUsers);
router.get("/user/:id", eAdmin, userController.getUser);
router.post("/user", eAdmin, userController.AddUser);
router.put("/user", eAdmin, userController.setUser);
router.put("/user-senha", eAdmin, userController.setUserPassword);
router.delete("/user/:id", eAdmin, userController.deleteUser);
router.post("/login", userController.loginUser);
router.post("/add-user-login", userController.addLoginUser);
router.get("/val-token", eAdmin, userController.validateToken);
router.get("/view-profile", eAdmin, userController.getViewProfile);
router.put("/edit-profile", eAdmin, userController.setEditProfile);
router.put("/edit-profile-password", eAdmin, userController.setProfilePassword);
router.post("/recover-password", eAdmin, userController.recoverPassword);
router.get("/val-key-recover-pass/:key", eAdmin, userController.valKeyRecoverPassword);
router.put("/update-password/:key", userController.setRecoverUpdatePassword);
router.put("/edit-profile-image", eAdmin, upload.single("image"), userController.setEditProfileImage);
router.put("/edit-user-image/:id", eAdmin, upload.single("image"), userController.setEditUserImage);
   

module.exports = router;
