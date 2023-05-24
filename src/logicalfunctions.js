const methods = require("./methods");
const constants = require("./constants");
const dataHandler = require("./dataHandler");

exports.offerRedemtionRateInOofN = function (cash, price, wrapper_needed, type) {
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
    if (!methods.isOfferValid(cash, price, wrapper_needed)) {
        return "Infinite amount of candy is possible";
    }

    wrapper[type] = Math.floor(cash / price);

    if (wrapper[type] >= wrapper_needed) {
        let temp = methods.calculateIfProceed(wrapper, wrapper_needed);
        while (temp !== null) {
            let newChoc = Math.floor(wrapper[temp] / wrapper_needed);
            for (let i of constants.bonusMap[temp]) {
                ans[i] = Math.floor(ans[i] + newChoc);
                if (wrapper[temp] >= wrapper[i]) wrapper[i] = Math.floor(wrapper[i] % wrapper_needed + newChoc);
                else wrapper[i] = wrapper[i] + newChoc;
            }
            temp = methods.calculateIfProceed(wrapper, wrapper_needed);
        }

    }
    return ans;
}


exports.offerRedemtionRateInOofONE = function (cash, price, wrapper_needed, type) {
    var ans = {
        milk: 0,
        white: 0,
        sf: 0,
        dark: 0
    };

    ans[type] = Math.floor(cash / price);
    var origin = Math.floor(cash / price);
    if (!methods.isOfferValid(cash, price, wrapper_needed)) {
        return "Infinite amount of candy is possible";
    }

    ans[type] = ans[type] + Math.floor((ans[type] - 1) / (wrapper_needed - 1));
    while (constants.extraBonus[type]) {
        var gain = ans[type] - origin;
        if (gain < 1) break;
        ans[constants.extraBonus[type]] = gain;
        origin = gain;
        type = constants.extraBonus[type];
        ans[type] = ans[type] + Math.floor((ans[type] - 1) / (wrapper_needed - 1));
    }
    return ans;
}
