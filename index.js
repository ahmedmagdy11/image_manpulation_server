const express = require("express");
const app = require("express")();
const router = require("./router/router");

app.use(express.json());
app.use(router);

app.listen(3000, () => {
    console.log("App is listening on port 3000");
});