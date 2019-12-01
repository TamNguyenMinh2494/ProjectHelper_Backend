const app = require('express')();
const apiHelper = new (require('ambrosentk-api-helper').create)();

const DB_URL = "https://uploadfile-85eef.firebaseio.com";
const keys = require("../key.json")
const admin = require("./database");

const db = new admin(keys, DB_URL);

const port = 3000;
app.use(require('body-parser')());
app.use(require("cors")());

app.get("/hello/:name/:age", (req, res) => {
    res.send("Hello " + req.params.name + ": " + req.params.age);
});
app.post("/project/update", async (req, res) => {
    console.log(req.body);
    // case 1: res phải có 3 fields : title, price, type
    let result = await apiHelper.validate(req.body, [
        { link: "title" }, // req.body phai co title moi chay
        { link: "price" },
        // {
        //     link: "price", process: (price) =>
        //         ({ status: (price > 10000), failedMessage: "Price must be greater than 10000" }) //tra ve json phai dung ngoac tron
        // },
        { link: "type" },
        { link: "description" }
    ]);

    if (result.status) {
        db.updateRequirement(req.body);
        res.send({ status: "Update Successfully!" });
    }
    else
        res.send(result);

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