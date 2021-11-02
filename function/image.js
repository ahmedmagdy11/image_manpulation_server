module.exports = {
    getNewImagePath,
    deleteTheOldImageAndRename
}
const { unlink, rename } = require("fs/promises");
const path = require("path");
function getNewImagePath(oldPath) {
    const oldName = path.basename(oldPath);
    const newName = oldName.split(".")[0] + "temp" + path.extname(oldName);

    return oldPath.replace(oldName, newName);
}

async function deleteTheOldImageAndRename(oldName, newName) {
    await unlink(oldName);
    await rename(newName, oldName);
}