const express = require("express");
const cors = require('cors');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const bodyParser = require('body-parser');

const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],
};
app.use(cors(corsOpts))

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

const loadData = (path) => {
    try {
        return fs.readFileSync(path, 'utf8')
    } catch (err) {
        console.error(err)
        return false
    }
}

const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}


app.get("/getJSON", (req, res) => {
    let result = loadData("./result/result.json")
    res.json(JSON.parse(result));
});

app.post("/postJSON", function (request, response) {
    if (!request.body) return response.sendStatus(400);
    let temp = request.body
    console.log(temp);
    storeData(request.body, "./result/result.json")
    response.send(request.body);
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
