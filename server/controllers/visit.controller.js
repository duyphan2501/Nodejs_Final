import VisitModel from "../models/visit.model.js";
const recordVisit = async (req, res, next) => {
  try {
    const newVisit = new VisitModel({
      userId: req.user?._id || null,
      ipAddress: req.ip,
      deviceType: req.headers["user-agent"]?.includes("Mobile")
        ? "mobile"
        : "desktop",
      browser: req.headers["user-agent"],
      page: req.originalUrl,
    });

    await newVisit.save();

    res
      .status(201)
      .json({ success: true, message: "Lưu lượt truy cập thành công" });
  } catch (error) {
    next(error);
  }
};

const getDailyVisits = async (req, res, next) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-indexed
    const currentYear = today.getFullYear();

    // Chu kỳ hiện tại: 21 tháng trước → 20 tháng hiện tại
    const cycleCurrentStart = new Date(currentYear, currentMonth - 1, 21);
    const cycleCurrentEnd = new Date(currentYear, currentMonth, 20, 23, 59, 59);

    // Chu kỳ trước: 21 tháng trước - 1 → 20 tháng trước
    const cyclePreviousStart = new Date(currentYear, currentMonth - 2, 21);
    const cyclePreviousEnd = new Date(
      currentYear,
      currentMonth - 1,
      20,
      23,
      59,
      59
    );

    const results = await VisitModel.aggregate([
      {
        $match: {
          visitedAt: { $gte: cyclePreviousStart, $lte: cycleCurrentEnd },
        },
      },
      {
        $project: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$visitedAt" } },
        },
      },
      {
        $group: {
          _id: "$date",
          visits: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          visits: 1,
          cycle: {
            $cond: [
              {
                $and: [
                  {
                    $gte: [
                      "$_id",
                      cyclePreviousStart.toISOString().slice(0, 10),
                    ],
                  },
                  {
                    $lte: ["$_id", cyclePreviousEnd.toISOString().slice(0, 10)],
                  },
                ],
              },
              "previous",
              "current",
            ],
          },
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

export { recordVisit, getDailyVisits };
