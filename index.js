const express = require('express');
const {createReadStream} = require('fs');
const app = express();
const PORT = 3000;
var bodyParser = require('body-parser')
const fs = require('fs');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const bonusMap = {
    milk: ['milk', 'sf'],
    white: ['white', 'sf'],
    sf: ['sf', 'dark'],
    dark: ['dark']
};
const extraBonus = {
    milk: 'sf',
    white: 'sf',
    sf: 'dark',
    dark: null
}

function calculateIfProceed(wrapper, wrapper_needed) {
    for (let w in wrapper) {
        if (wrapper[w] >= wrapper_needed) return w;
    }
    return null;
}

function isOfferValid(cash, price, wrapper_needed) {
    if (Math.floor(cash / price) > 0 && wrapper_needed <= 1) return false;
    else return true;
}

function offerRedemtionRateInOofN(cash, price, wrapper_needed, type) {
    var ans = {
        milk: 0,
        white: 0,
        sf: 0,
        dark: 0
    };
    var wrapper = {
        milk: 0,
        white: 0,
        sf: 0,
        dark: 0
    };

    ans[type] = Math.floor(cash / price);
    if (!isOfferValid(cash, price, wrapper_needed)) {
        return "Infinite amount of candy is possible";
    }
    wrapper[type] = Math.floor(cash / price);
    if (wrapper[type] >= wrapper_needed) {
        let temp = calculateIfProceed(wrapper, wrapper_needed);
        while (temp !== null) {
            let newChoc = Math.floor(wrapper[temp] / wrapper_needed);
            for (let i of bonusMap[temp]) {
                ans[i] = Math.floor(ans[i] + newChoc);
                if (wrapper[temp] >= wrapper[i]) wrapper[i] = Math.floor(wrapper[i] % wrapper_needed + newChoc);
                else wrapper[i] = wrapper[i] + newChoc;
            }
            temp = calculateIfProceed(wrapper, wrapper_needed);
        }

    }
    return ans;
}

function offerRedemtionRateInOofONE(cash, price, wrapper_needed, type) {
    var ans = {
        milk: 0,
        white: 0,
        sf: 0,
        dark: 0
    };

    ans[type] = Math.floor(cash / price);
    var origin = Math.floor(cash / price);
    if (!isOfferValid(cash, price, wrapper_needed)) {
        return "Infinite amount of candy is possible";
    }

    ans[type] = ans[type] + Math.floor((ans[type] - 1) / (wrapper_needed - 1));
    while (extraBonus[type]) {
        var gain = ans[type] - origin;
        if (gain < 1) break;
        ans[extraBonus[type]] = gain;
        origin = gain;
        type = extraBonus[type];
        ans[type] = ans[type] + Math.floor((ans[type] - 1) / (wrapper_needed - 1));
    }
    return ans;
}

app.post('/', (req, res) => {
    res.send(offerRedemtionRateInOofONE(req.body.cash, req.body.price, req.body.wrapper_needed, req.body.type));
});

app.get('/', (req, res) => {
    var cash = 6, price = 2, wrapper_needed = 2, type = "white";
    res.send(offerRedemtionRateInOofN(cash, price, wrapper_needed, type));
});

function cleanOrderData(orders) {
    orders = orders.filter(x => x.length === 4);
    return orders;
}
function writeOutputToFile(ans){
    fs.writeFile("output/redemption.csv", ans, function(err) {
        if(err) {
            console.log(err);
            return err;
        }
    });
}
function getRedemeptionFromCSVOrders(orders){
    let result = [], ans='';
    for(let order of orders){
        var cash = Number(order[0]), price = Number(order[1]), wrapper_needed = Number(order[2]), type = order[3];
        result.push(offerRedemtionRateInOofN(cash, price, wrapper_needed, type));
    }
    for(let r of result){
        ans = ans + "milk "+r["milk"]+", "+"dark "+r["dark"]+", "+"white "+r["white"]+", "+"sugar free "+r["sf"]+"\n";
    }
    writeOutputToFile(ans);
    return ans;
}

app.get('/csv', (req, res) => {
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
                res.send("Data missing. 4 Headers are esential and which are CASH, PRICE, WRAPPER NEEDED, Type ").status(403);
            }
            orders = data.slice(1);
            orders = cleanOrderData(orders);
            res.send(getRedemeptionFromCSVOrders(orders));
        });
    })();
});

app.listen(PORT, (error) => {
    if (!error) console.log("Server is listening on port " + PORT)
});
