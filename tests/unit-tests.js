const axios = require("axios");
const {expect} = require("chai");

describe("initial test", async ()=> {
    it("should give proper redemeption", async ()=> {
        const res = await axios.post("http://localhost:3000/",{
            "cash": 6569,
            "price": 69,
            "wrapper_needed": 2,
            "type": "white"
        });
        console.log(res.data);
        expect(res.status).equal(200);
    })
})
