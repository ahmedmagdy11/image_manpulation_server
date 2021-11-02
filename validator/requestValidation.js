module.exports = {
    validateImages
}
const {stat} = require("fs/promises");
async function validateImages(images) {
    if (!Array.isArray(images)) {
        throw new Error("Images should be an array");
    }
    for await (const image of images) {
        await stat(image)
    }
    // you don't need the image ext type because it's coming for an interal server which validates this
    return;
}