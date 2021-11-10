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

    await asyncExec(`ffmpeg -i ${image} -q:v ${process.env.COMPRESSION_PARMETER} ${newImage} -y`);
    deleteTheOldImageAndRename(image, newImage);
    return;
}

async function addWaterMark(image) {
    const newImage = getNewImagePath(image);
    const watermark = __dirname.replace("function", "watermark-100%.png");
    const applyWaterMark = `ffmpeg -y \
    -i ${image} \
    -i  ${watermark} \
    -filter_complex "\
    [1][0]scale2ref=h=ow/mdar:w=iw/4[#A watermark][main_image];\
    [#A watermark]format=argb,colorchannelmixer=aa=0.7[#B watermark transparent];\
    [main_image][#B watermark transparent]overlay\
    =(main_w-w)/4:(main_h-h)/2" \
    ${newImage}`;
    await asyncExec(applyWaterMark);
    deleteTheOldImageAndRename(image, newImage);
    return;
}
async function resize(image) {
    const newImage = getNewImagePath(image);
    await asyncExec(` ffmpeg -i ${image} -vf scale=w=650:h=330 ${newImage} -y`);
    deleteTheOldImageAndRename(image, newImage);
    return;
}