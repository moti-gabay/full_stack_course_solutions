import { Router } from "express";
import { Recipe } from "../models/Recipe.js";

const router = Router();

router.get("/", async (req, res) => {
  const [byDifficulty, prep, topTags] = await Promise.all([
    Recipe.aggregate([
      { $group: { _id: "$difficulty", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Recipe.aggregate([{ $group: { _id: null, average: { $avg: "$prepMinutes" } } }]),
    Recipe.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 5 },
    ]),
  ]);

  res.json({
    byDifficulty: Object.fromEntries(byDifficulty.map((d) => [d._id, d.count])),
    avgPrepMinutes: prep.length ? Math.round(prep[0].average * 10) / 10 : 0,
    topTags: topTags.map((t) => ({ tag: t._id, count: t.count })),
  });
});

export default router;
