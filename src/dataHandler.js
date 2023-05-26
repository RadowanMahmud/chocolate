const fs = require('fs');
const logics = require('./logicalfunctions')

exports.cleanOrderData = function (orders) {
    orders = orders.filter(x => x.length === 4);
    return orders;
}

exports.writeOutputToFile = function (ans) {
    fs.writeFile("output/redemption.csv", ans, function (err) {
        if (err) {
            console.log(err);
            return err;
        }
    });
}
exports.getRedemeptionFromCSVOrders = function (orders) {
    let result = [], ans = '';
    for (let order of orders) {
        var cash = Number(order[0]), price = Number(order[1]), wrapper_needed = Number(order[2]), type = order[3];
        result.push(logics.offerRedemtionRateInOofN(cash, price, wrapper_needed, type));
    }
    for (let r of result) {
        ans = ans + "milk " + r["milk"] + ", " + "dark " + r["dark"] + ", " + "white " + r["white"] + ", " + "sugar free " + r["sugar_free"] + "\n";
    }
    return ans;
}

