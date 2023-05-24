const axios = require("axios");
const {expect} = require("chai");

describe("initial test", async ()=> {
    it("should give proper redemeption", async ()=> {
        const res = await axios.get("http://localhost:3000/");
        console.log(res.data);
        expect(res.status).equal(200);
    })
})
