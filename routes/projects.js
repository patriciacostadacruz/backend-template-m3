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
router.post("/", async (req, res, next) => {
  // add validations so that no empty field for required items is passed
  // also add validations for field types
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
router.get("/:projectId", async (req, res, next) => {
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
router.put("/:projectId", async (req, res, next) => {
  const {projectId} = req.params;
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
router.delete("/:projectId", async (req, res, next) => {
  const {projectId} = req.params;
  try {
    const deletedProject = await Project.findByIdAndDelete(projectId);
    res.status(201).json(deletedProject);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
