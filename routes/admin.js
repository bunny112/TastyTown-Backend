router.get("/stats", protect, isAdmin, async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "Pending" });

  const revenue = await Order.aggregate([
    { $match: { status: "Delivered" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);

  const totalUsers = await User.countDocuments({ role: "user" });

  res.json({
    totalOrders,
    pendingOrders,
    totalUsers,
    revenue: revenue[0]?.total || 0
  });
});
