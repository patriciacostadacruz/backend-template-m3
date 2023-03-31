const router = require("express").Router();
const Project = require("../models/Project");
const { isAuthenticated } = require("../middlewares/jwt");

// @desc    Gets all projects
// @route   GET /projects
// @access  Public
router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
});

// @desc    Creates new project
// @route   POST /projects
// @access  Private
router.post("/", isAuthenticated, async (req, res, next) => {
  const {
    title,
    status,
    location,
    description,
    industry,
    fundingNeeded
  } = req.body;
  const { _id: owner } = req.payload;
  if (!title || !status || !location || !description || industry.length < 1 || !fundingNeeded || !owner) {
    res.status(400).json({ message: "Please fill all the fields to add a new project." });
    return;
  }
  try {
    const newProject = await Project.create({ title, status, location, description, industry, fundingNeeded, owner });
    res.status(201).json(newProject);
  } catch (error) {
    next(error);
  }
});

// @desc    Get one project
// @route   GET /projects/:projectId
// @access  Private
router.get("/:projectId", isAuthenticated, async (req, res, next) => {
  const {projectId} = req.params;
  try {
    const project = await Project.findById(projectId);
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
});

// @desc    Updates a project
// @route   PUT /projects/:projectId
// @access  Private && Owner
router.put("/:projectId", isAuthenticated, async (req, res, next) => {
  const {projectId} = req.params;
  const {
    title,
    status,
    location,
    description,
    industry,
    fundingNeeded,
  } = req.body;
  if (
    !title ||
    !status ||
    !location ||
    !description ||
    industry.length < 1 ||
    !fundingNeeded 
  ) {
    res
      .status(400)
      .json({ message: "Please fill all the fields to update this project." });
    return;
  }
  try {
    await Project.findByIdAndUpdate(projectId, req.body, {new: true});
    res.status(204).json({message: "Project data updated successfully."});
  } catch (error) {
    next(error);
  }
});

// @desc    Deletes a project
// @route   DELETE /projects/:projectId
// @access  Private && Owner
router.delete("/:projectId", isAuthenticated, async (req, res, next) => {
  const {projectId} = req.params;
  try {
    const deletedProject = await Project.findByIdAndDelete(projectId);
    res.status(201).json(deletedProject);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
