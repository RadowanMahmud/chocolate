exports.calculateIfProceed = function (wrapper, wrapper_needed) {
    for (let w in wrapper) {
        if (wrapper[w] >= wrapper_needed) return w;
    }
    return null;
}
exports.isOfferValid = function (cash, price, wrapper_needed) {
    if (Math.floor(cash / price) > 0 && wrapper_needed <= 1) return false;
    else return true;
}
