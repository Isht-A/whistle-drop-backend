const Report = require("../models/Incident");

const STATUS_FLOW = {
  SUBMITTED: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["RESOLVED", "DISMISSED"],
  RESOLVED: [],
  DISMISSED: []
};

exports.submitReport = async (req, res) => {
  try {
    const { category, description, evidenceUrl } = req.body;

    if (!category || !description) {
      return res.status(400).json({
        ok: false,
        message: "category and description are required"
      });
    }

    const report = await Report.create({
      category: category.trim(),
      description: description.trim(),
      evidenceUrl: evidenceUrl || null
    });

    return res.status(201).json({
      ok: true,
      caseCode: report.caseCode,
      status: report.status,
      submittedAt: report.createdAt
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ ok: false, message: err.message });
    }
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

exports.getReportByCaseCode = async (req, res) => {
  try {
    const { caseCode } = req.params;

    if (!caseCode) {
      return res.status(400).json({ ok: false, message: "Missing case code" });
    }

    const report = await Report.findOne({ caseCode }).select("-__v");
    if (!report) {
      return res.status(404).json({ ok: false, message: "Report not found" });
    }

    return res.status(200).json({
      ok: true,
      data: {
        caseCode: report.caseCode,
        category: report.category,
        description: report.description,
        evidenceUrl: report.evidenceUrl,
        status: report.status,
        updates: report.statusHistory,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt
      }
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

exports.getModeratorReports = async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    const reports = await Report.find(filter).sort({ createdAt: -1 }).select("-__v");

    return res.status(200).json({
      ok: true,
      total: reports.length,
      data: reports
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Failed to fetch reports" });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status || !note) {
      return res.status(400).json({
        ok: false,
        message: "Status and note are required"
      });
    }

    const report = id.startsWith("WD-")
      ? await Report.findOne({ caseCode: id })
      : await Report.findById(id);

    if (!report) {
      return res.status(404).json({ ok: false, message: "Report not found" });
    }

    const allowed = STATUS_FLOW[report.status] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        ok: false,
        message: `Illegal transition: '${report.status}' can only move to: [${allowed.join(", ")}]`
      });
    }

    report.status = status;
    if (!report.statusHistory) report.statusHistory = [];
    report.statusHistory.push({
      status,
      moderatorNote: note.trim(),
      recordedAt: new Date()
    });

    await report.save();

    return res.status(200).json({
      ok: true,
      message: "Status updated successfully",
      updatedReport: report
    });
  } catch (err) {
    console.error("Status update error:", err);
    return res.status(500).json({ ok: false, message: err.message || "Failed to update status" });
  }
}; 