const axios = require("axios");
const {expect} = require("chai");
var type = ["milk", "white", "sf", "dark"];
const logics = require("../src/logicalfunctions");
const cases = require("./case");

for(let c of cases.case){
    describe("Testing solutions functions with "+c[0], async () => {
        it('O(N)', function () {
            var ans = logics.offerRedemtionRateInOofN(c[0][0],c[0][1],c[0][2],c[0][3]);
            for (let t of type) {
                expect(ans[t]).equal(c[1][t]);
            }
        });
        it('O(1)', function () {
            var ans = logics.offerRedemtionRateInOofONE(c[0][0],c[0][1],c[0][2],c[0][3]);
            for (let t of type) {
                expect(ans[t]).equal(c[1][t]);
            }
        });
    })

    describe("Comparing both solutions "+c[0], async () => {
        it("Comparing both solutions", async () => {
            var body = {
                "cash": c[0][0],
                "price": c[0][1],
                "wrapper_needed": c[0][2],
                // "type": type[Math.floor(Math.random() / 4)]
                "type": c[0][3]
            }
            const res = await axios.post("http://localhost:3000/", body);
            const resStable = await axios.post("http://localhost:3000/stable", body);
            console.log(res.data)
            for (let t of type) {
                expect(res.data[t]).equal(resStable.data[t]);
            }
        })
    })
    describe("Comparing both solutions "+c[0]+" but with random type", async () => {
        it("Comparing both solutions", async () => {
            var body = {
                "cash": c[0][0],
                "price": c[0][1],
                "wrapper_needed": c[0][2],
                "type": type[Math.floor(Math.random() / 4)]
            }
            const res = await axios.post("http://localhost:3000/", body);
            const resStable = await axios.post("http://localhost:3000/stable", body);
            for (let t of type) {
                expect(res.data[t]).equal(resStable.data[t]);
            }
        })
    })
}
