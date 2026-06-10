const express = require("express");
const router = express.Router();
const protectedController = require("../controllers/protected.controller");
const asyncHandler = require("../utils/asyncHandler");
const auth = require("../middlewares/auth"); // الميدل وير الذي يفحص التوكن في الكوكي
const restrictTo = require("../middlewares/restrictTo"); // ميدل وير الأدوار (سنكتبه بالأسفل)
const { param } = require("express-validator"); // التحقق من الـ ID المطلوبة بالتاسك
const { IDUserValidation } = require("../validations/users.validate");

// 🔓 1 & 2: مسارات محمية بالتوكن فقط (متاحة للكل)
router.get("/me/welcome", auth, asyncHandler(protectedController.getWelcome));
router.get(
  "/me/account-summary",
  auth,
  asyncHandler(protectedController.getAccountSummary),
);

// 🔒 3 & 4: مسارات محمية بالتوكن + مخصصة للـ Admin فقط
router.get(
  "/overview",
  auth,
  restrictTo("admin"),
  asyncHandler(protectedController.getOverview),
);
router.get(
  "/admin/users",
  auth,
  restrictTo("admin"),
  asyncHandler(protectedController.getUsers),
);

// 🔒 5: مسار الحذف للـ Admin فقط + التحقق أن الـ ID المرسل هو MongoId صالح (شرط express-validator)
router.delete(
  "/admin/users/:id",
  auth,
  [IDUserValidation, restrictTo("admin")],
  asyncHandler(protectedController.deleteUser),
);

module.exports = router;
