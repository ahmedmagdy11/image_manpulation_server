module.exports = {
    pipeline
}
const { getNewImagePath, deleteTheOldImageAndRename } = require("./image");
const { exec } = require("child_process");
const { promisify } = require("util");

const asyncExec = promisify(exec);
async function pipeline(images = [], options = {}) {
    for await (const image of images) {
        if (options.compress) {
            await compress(image);
        }

        if (options.watermark) {
            await addWaterMark(image);
        }
        // resize should be after watermark
        if (options.resize) {
            await resize(image);
        }

    }
    return;
}

async function compress(image) {
    const newImage = getNewImagePath(image);
    await asyncExec(`ffmpeg -i ${image} -q:v 25 ${newImage} -y`);
    deleteTheOldImageAndRename(image, newImage);
    return;
}

async function addWaterMark(image) {
    const newImage = getNewImagePath(image);
    const watermark = "/home/ahmed/image_manpulation_server/watermark.png";
    await asyncExec(` ffmpeg -i ${image} -i ${watermark} -filter_complex "overlay=320:250" ${newImage} -y`);
    deleteTheOldImageAndRename(image, newImage);
    return;
}
async function resize(image) {
    const newImage = getNewImagePath(image);
    await asyncExec(` ffmpeg -i ${image} -vf scale=w=700:h=500 ${newImage} -y`);
    deleteTheOldImageAndRename(image, newImage);
    return;
}