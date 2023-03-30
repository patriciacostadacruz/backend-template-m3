const isOwner = (Model) => async (req, res, next) => {
  const { _id: userId } = req.payload;
  const { id } = req.params;
  try {
    const document = await Model.findById(id);
    if (!document) {
      res.status(404).json({ message: "Document not found." });
			return;
    }
    const ownerId = document.owner || document.sender;
    if (ownerId == userId) {
      req.document = document;
      next();
    } else {
      res
        .status(401)
        .json({ message: "You are not allowed to perform this action." });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = isOwner;
