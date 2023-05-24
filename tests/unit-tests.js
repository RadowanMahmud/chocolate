const axios = require("axios");
const {expect} = require("chai");
var type = ["milk", "white", "sf", "dark"];

describe("Comparing both solutions", async () => {
    it("Comparing both solutions", async () => {
        var body = {
            "cash": 6,
            "price": 2,
            "wrapper_needed": 2,
            "type": type[Math.floor(Math.random() / 4)]
        }
        const res = await axios.post("http://localhost:3000/", body);
        const resStable = await axios.post("http://localhost:3000/stable", body);
        console.log(body)
        console.log(res.data)
        console.log(resStable.data)
        for (let t of type) {
            expect(res.data[t]).equal(resStable.data[t]);
        }
    })
})
