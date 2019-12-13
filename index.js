const app = require('express')();
const apiHelper = new (require('ambrosentk-api-helper').create)();

const DB_URL = "https://uploadfile-85eef.firebaseio.com";
const keys = require("../key.json")
const admin = require("./database");

const db = new admin(keys, DB_URL);

const port = 3000;
app.use(require('body-parser')());
app.use(require("cors")());

// app.get("/project/name/:key", (req, res) => {
//     res.send("Hello " + req.params.key);
// });
// app.get("/project/all", async (req, res) => {
//     let status = await db.getAllRequirements();
//     console.log(status);
//     //res.send(req.body);
// })
app.get("/project/all", async (req, res) => {
    let result = await db.getAllRequirements();
    res.send(result);
    console.log(result);
})
app.post("/project/create", async (req, res) => {
    console.log(req.body);
    let result = await apiHelper.validate(req.body, [
        { link: "title" }, // req.body phai co title moi chay
        { link: "price" },
        { link: "type" },
        { link: "description" },
        { link: "ownerId" }
    ]);
    if (result.status) {
        let status = await db.createRequirement(req.body);
        console.log(req.body);
        res.send({ status: status });
    }
    else
        res.send({ status: "Create Failed!" });
})
app.post("/project/update", async (req, res) => {
    console.log(req.body);
    let uid = req.body.uid;
    let docId = req.body.key;
    // case 1: res phải có 3 fields : title, price, type
    let result = await apiHelper.validate(req.body, [
        { link: "title" }, // req.body phai co title moi chay
        { link: "price" },
        { link: "type" },
        { link: "description" },
        { link: "uid" },
        { link: "key" }
    ]);

    if (result.status) {
        let status = await db.updateRequirement(uid, docId, req.body);
        res.send({ status: status });
    }
    else
        res.send({ status: "Update Failed!" });

});

app.post("/project/delete", async (req, res) => {
    console.log(req.body);
    let uid = req.body.uid;
    let docId = req.body.key;
    let result = await apiHelper.validate(req.body, [
        { link: "uid" },
        { link: "key" }
    ]);
    if (result.status) {
        let status = await db.deleteRequirement(uid, docId);
        res.send({ status: status });
    }
    else {
        res.send({ status: "Delete Failed!" });
    }
})

app.listen(port, () => {
    console.log("Server is running");
})