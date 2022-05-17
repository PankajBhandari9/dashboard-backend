const express = require("express");
const app = express();
require("./db/conn");
const cors = require("cors");
const userModel = require("./model/userModel");
const productModel = require("./model/productModel");
const Jwt = require("jsonwebtoken");
const jwtKey = "e-com";


app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
    res.send("Hello from express");
})

app.post("/signup", async (req, res) => {
    try {
        // res.send(req.body);
        let user = await new userModel(req.body);
        await user.save();
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: '2h' }, (err, token) => {
                if (err) {
                    res.send({ result: "Sorry, no user found with token included" })
                }
                res.status(200).send({ user, auth: token });
            })
        } else {
            res.send({ result: "Sorry nothing found" })
        }
        // res.send(result);
        // console.log(await result);

    } catch (err) {
        console.log("Sorry error while posting" + err);
    }
})

app.post("/login", async (req, res) => {

    if (req.body.email && req.body.password) {

        let user = await userModel.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: '2h' }, (err, token) => {
                if (err) {
                    res.send({ result: "Sorry, no user found with token included" })
                }
                res.status(200).send({ user, auth: token });
            })
        } else {
            res.send({ result: "Sorry nothing found" })
        }

    } else {
        res.send({ result: "Sorry, no user found" })
    }

})

app.post("/add-product",verifyToken, async (req, res) => {
    // res.send(req.body)

    let result = await new productModel(req.body);
    result = await result.save();
    res.send(result);

});

app.get("/products",verifyToken, async (req, res) => {
    let result = await productModel.find();
    if (result) {
        res.send(result);
    } else {
        res.send({ result: "Sorry No Result found, Product List is empty" })
    }
});

app.delete("/product/:id",verifyToken, async (req, res) => {
    // res.send(req.params.id);
    let result = await productModel.deleteOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    } else {
        res.send({ result: "Sorry no result found, Not deleted" })
    }
})

app.get("/product/:id", async (req, res) => {
    let result = await productModel.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    } else {
        res.status(404).send({ result: "Sorry No Record Found" })
    }
})

app.patch("/product/:id",verifyToken, async (req, res) => {
    const _id = req.params.id;
    let result = await productModel.findByIdAndUpdate(_id, req.body, {
        new: true
    });
    if (!result) {
        res.send({ result: "Sorry No Data found to change/update" })
    } else {
        res.send(result);
    }
})

// search api
app.get("/search/:key", verifyToken, async (req, res) => {
    const key = req.params.key;

    let result = await productModel.find({
        "$or": [
            { productName: { $regex: key } },
            { productCatagory: { $regex: key } },
            { productCompany: { $regex: key } }
        ]
    });

    if (result.length > 0) {
        res.send(result);
    } else {
        res.send({ result: "Sorry No Result Found" })
    }
})

function verifyToken(req, res, next) {
    // console.log("Middelwear called for verification");
    // console.log(req.headers['authorization']);
    let token = req.headers['authorization'];
    // console.log(token);
    if (token) {
        token = token.split(" ")[1];
        // console.log(token);
        Jwt.verify(token, jwtKey, (error, success) => {
            if (error) {
                res.send({ result: "Sorry token is not authorized" })
            } else {
                next();
            }
        })
    } else {
        res.send({ result: "You should send the token to access the data." })
    }
    // next();
}

app.listen(5000, () => {
    console.log("port at 5000");
})