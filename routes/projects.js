const router = require("express").Router();
const Project = require("../models/Project");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");

// @desc    Gets all projects
// @route   GET /projects
// @access  Public
router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
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
    fundingNeeded,
    owner
  } = req.body;
  if (!title || !status || !location || !description || !industry || !fundingNeeded || !owner) {
    res.status(400).json({ message: "Please fill all the fields to add a new project." });
    return;
  }
  try {
    const newProject = await Project.create(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
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
    console.error(error);
  }
});

// @desc    Updates a project
// @route   PUT /projects/:projectId
// @access  Private
router.put("/:projectId", isAuthenticated, async (req, res, next) => {
  const {projectId} = req.params;
  const {
    title,
    status,
    location,
    description,
    industry,
    fundingNeeded,
    owner,
  } = req.body;
  if (
    !title ||
    !status ||
    !location ||
    !description ||
    !industry ||
    !fundingNeeded ||
    !owner
  ) {
    res
      .status(400)
      .json({ message: "Please fill all the fields to update this project." });
    return;
  }
  try {
    const response = await Project.findByIdAndUpdate(projectId, req.body, {new: true});
    res.status(204).json({message: "Project data updated successfully."});
  } catch (error) {
    console.error(error);
  }
});

// @desc    Deletes a project
// @route   DELETE /projects/:projectId
// @access  Private
router.delete("/:projectId", isAuthenticated, async (req, res, next) => {
  const {projectId} = req.params;
  try {
    const deletedProject = await Project.findByIdAndDelete(projectId);
    res.status(201).json(deletedProject);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
