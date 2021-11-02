const { Router } = require("express");
const { pipeline } = require("../function/pipeline");
const { validateImages } = require("../validator/requestValidation");
const router = Router();


router.post("/apply", async (req, res, next) => {
    try {
        const { images, options } = req.body;
        await validateImages(images);
        await pipeline(images, options);
        res.send({ "message": "done" });
    } catch (e) {
        console.log(e.message + " ", new Date().toLocaleDateString());
        return res.status(500).send({ "message": "Something went wrong" });
    }
});


module.exports = router;