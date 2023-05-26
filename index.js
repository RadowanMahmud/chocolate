const express = require('express');
const {createReadStream} = require('fs');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser')
const fs = require('fs');
const cors = require('cors');
app.use(cors());


app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const dataHandler = require("./src/dataHandler");
const logics = require("./src/logicalfunctions");

app.post('/', (req, res) => {
    res.send(logics.offerRedemtionRateInOofONE(req.body.cash, req.body.price, req.body.wrapper_needed, req.body.type));
});
app.post('/stable', (req, res) => {
    res.send(logics.offerRedemtionRateInOofN(req.body.cash, req.body.price, req.body.wrapper_needed, req.body.type));
});

app.get('/', (req, res) => {
    const data = [];
    var header = [], orders = [];
    (() => {
        const readStream = createReadStream('input/orders.csv', {
            encoding: 'utf8',
        });
        readStream.on('data', (chunk) => {
            data.push(
                ...chunk.split(/\r\n/).map((line) => {
                    return line.split(',');
                })
            );
        });
        readStream.on('error', (err) => {
            console.log(err);
        });

        readStream.on('end', () => {
            header = data[0];
            if (header.length !== 4) {
                res.send("Data missing. 4 Headers are essential and which are CASH, PRICE, WRAPPER NEEDED, Type ").status(403);
            }
            orders = data.slice(1);
            orders = dataHandler.cleanOrderData(orders);
            var result = dataHandler.getRedemeptionFromCSVOrders(orders);
            dataHandler.writeOutputToFile(result);
            res.send(result);
        });
    })();
});

app.listen(PORT, (error) => {
    if (!error) console.log("Server is listening on port " + PORT)
});
