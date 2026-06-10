const User = require("../models/Users");

class ProtectedController {
  // 🔓 مسارات متاحة لأي مستخدم مسجل دخول (User أو Admin)
  getWelcome = async (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Welcome! This endpoint is accessible by any authenticated user.",
    });
  };

  getAccountSummary = async (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Here is your account summary. Secure data fetched successfully.",
    });
  };

  // 🔒 مسارات مخصصة للـ Admin فقط
  getOverview = async (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Admin! This is the system overview dashboard.",
    });
  };

  getUsers = async (req, res) => {
    // جلب كل المستخدمين من قاعدة البيانات كدليل على صلاحية الأدمن
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  };

  deleteUser = async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: `User with ID ${id} has been deleted successfully by Admin.`,
    });
  };
}

module.exports = new ProtectedController();
