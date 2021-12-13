const express = require('express');
const cors = require('cors');
const Flagship = require("@flagship.io/js-sdk");
const app = express(); 
const port = process.env.PORT || 8000;

app.use(cors());

app.get('/api', (req, res) => {
    console.log("Call FS...");
    const vid = req.query.vid;
    const apikey = req.query.apikey;
    const envid = req.query.envid;
    console.log(req.query);
    if (!vid) {
        res.status(400).send("missing ?vid param (visitor id)");
    }
    if (!apikey) {
        res.status(400).send("missing ?apikey param (apikey)");
    }
    if (!envid) {
        res.status(400).send("missing ?envid param (environment id)");
    }
    let logs = [];

    const config = {};
    const fsInstance = Flagship.start(
        envid,
        apikey,
        config
    );

    const fsVisitorInstance = fsInstance.newVisitor(vid, {});
    fsVisitorInstance.on("ready", () => {
        logs.push(JSON.stringify(fsVisitorInstance.fetchedModifications));
        if (fsVisitorInstance.fetchedModifications) {
            fsVisitorInstance.fetchedModifications.forEach(function (v, i) {
                const key = Object.keys(
                fsVisitorInstance.fetchedModifications[i]["variation"]["modifications"][
                    "value"
                ]
                )[0];
                if (key === "evaluationHourPrice") {
                    logs.push(JSON.stringify(fsVisitorInstance.fetchedModifications[i]["variation"]["modifications"]["value"]));
                }
            });
        }

        res.status(200).send(logs.join("<br/><br/>"));
    });
});
  
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
