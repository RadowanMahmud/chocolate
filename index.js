const express = require('express');

const app = express();
const PORT = 3000;

const bonusMap = {
    milk: ['milk','sf'],
    white: ['white', 'sf'],
    sf: ['sf','dark'],
    dark: ['dark']
};

function calculateIfProceed(wrapper,wrapper_needed)
{
    for(let w in wrapper)
    {
        if(wrapper[w] >= wrapper_needed) return w;
    }
    return null;
}

app.get('/', (req, res) => {
    var cash = 6569, price = 69, wrapper_needed = 2, type = "white";
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

    ans[type] = Math.floor(cash/price);
    if(ans[type] > 0 && wrapper_needed <= 1)
    {
        res.send("Infinite amount of candy is possible");
    }
    wrapper[type] = Math.floor(cash/price);
    if(wrapper[type] >= wrapper_needed)
    {
        let temp = calculateIfProceed(wrapper,wrapper_needed);
        while (temp !== null)
        {
            let newChoc = Math.floor(wrapper[temp]/wrapper_needed);
            for(let i of bonusMap[temp]){
                ans[i] = Math.floor(ans[i] + newChoc);
                if(wrapper[temp] >= wrapper[i]) wrapper[i] = Math.floor(wrapper[i]%wrapper_needed +newChoc);
                else  wrapper[i] =  wrapper[i] + newChoc;
            }
            temp = calculateIfProceed(wrapper,wrapper_needed);
        }

    }
    res.send(ans);
});

app.listen(PORT, (error) => {
        if (!error) console.log("Server is listening on port " + PORT)
});
