const express = require("express");
const cors = require('cors');
const fs = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
const bodyParser = require('body-parser');
let lastData = [];
let JSONdata = [];


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
        return fs.readFileSync(path, 'utf8');
    } catch (err) {
        console.error(err)
        return false
    }
}

const storeData = (data, path, mode) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data), { flag: mode })
    } catch (err) {
        console.error(err)
    }
}


app.get("/getJSON", (req, res) => {
    let result = loadData("./result/heading.json");
    res.json(JSON.parse(result));
});


app.post("/postJSON", function (request, response) {
    if (!request.body) return response.sendStatus(400);
    let reverse_array = request.body.reverse();

    for (const element of reverse_array) {
        lastData.push(element.link);
        if (lastData.length > 100)
            lastData.shift();
    }

    storeData(reverse_array, "./result/result.json", "a");
    storeData(lastData, "./result/heading.json", "w");
    response.send(request.body);
});

app.listen(PORT, () => {
    fs.access("./result/result.json", fs.constants.F_OK, (error) => {
        if (error) {
            console.log('result file created');
            fs.writeFileSync("./result/result.json", '', { flag: 'wx' });
            fs.writeFileSync("./result/heading.json", '[]', { flag: 'w' });
        }
        else {
            console.log('processing last data...');
            let JSONdata = fs.readFileSync("./result/result.json");
            if (JSONdata.length !== 0) {
                JSONdata = JSON.parse(JSONdata);
                lastData = JSONdata.slice(-100);
                lastData.forEach((element, i, lastData) => (lastData[i] = element.link))
                fs.writeFileSync("./result/heading.json", JSON.stringify(lastData), { flag: 'w' });
            }
        }
        console.log('complete!');
    });
    console.log(`Server listening on ${PORT}`);
});
