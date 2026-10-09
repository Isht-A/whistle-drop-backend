const express = require("express");
const router = express.Router();
const verifyModerator = require("../middleware/auth");
const {
  submitReport,
  getReportByCaseCode,
  getModeratorReports,
  updateReportStatus
} = require("../controllers/reportController");


router.post("/reports", submitReport);
router.get("/reports/:caseCode", getReportByCaseCode);


router.get("/moderator/reports", verifyModerator, getModeratorReports);
router.patch("/moderator/reports/:id/status", verifyModerator, updateReportStatus);

module.exports = router;