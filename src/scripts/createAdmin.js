require("dotenv").config();
const hash = require("../utils/PasswordSrevice");
const Users = require("../models/Users");
const connectDB = require("../utils/connectDB");

const creatAdmin = async () => {
  await connectDB();

  const adminCount = await Users.countDocuments({ role: "admin" });
  if (adminCount >= 2) {
    console.log(
      "⚠️ فشلت العملية: عدد الأدمن ممتلئ بالفعل في قاعدة البيانات (الحد الأقصى 2)!",
    );
    return false; // 🎯 نرجع false لنعلم الـ then أن العملية لم تتم فعلياً
  }

  const admin = {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: await hash.hashPassword(process.env.ADMIN_PASSWORD),
    role: "admin",
  };

  await Users.create(admin);
  return true; // 🎯 نرجع true لأن الإنشاء تم بنجاح
};

// تشغيل السكريبت الفعلي
creatAdmin()
  .then((isCreated) => {
    // 🎯 نفحص القيمة الراجعة من الدالة لطبع الرسالة الصحيحة
    if (isCreated) {
      console.log("✅ Admin created successfully in database.");
    } else {
      console.log("ℹ️ No new admin was added (Limit reached).");
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("🚨 Error creating admin:", err.message);
    process.exit(1); // الخروج بكود خطأ 1 في حال الكراش
  });
