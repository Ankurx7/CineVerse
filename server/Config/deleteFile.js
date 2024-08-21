const path = require("path");
const fs = require("fs");

const deleteImageFile = (req, deleteImage) => {
    try {
        const rootDir = path.dirname(require.main.filename);
        const filePath = path.join(rootDir, `/public/storyImages/${deleteImage}`);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            } else {
                console.log("File deleted successfully");
            }
        });
    } catch (error) {
        console.error("Error in deleteImageFile function:", error);
    }
};

module.exports = deleteImageFile;