const express = require('express');
const Flagship = require("@flagship.io/js-sdk");
const app = express(); 
const port = process.env.PORT || 8000;

app.get('/api', (req, res) => {
    console.log("Call FS...");
    const vid = req.query.vid;
    if (!vid) {
        res.status(400).send("missing ?vid param");
    }
    let logs = [];

    const config = {};
    const fsInstance = Flagship.start(
        "bvvol5cmicqk8sigckng",
        "d5UIKzy8Lp58DuASSGmS3dHECjXtpus1mHRtdwe7",
        config
    );

    const fsVisitorInstance = fsInstance.newVisitor(vid, {});
    fsVisitorInstance.on("ready", () => {
        logs.push(JSON.stringify(fsVisitorInstance.fetchedModifications));
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

        res.status(200).send(logs.join("<br/><br/>"));
    });
});
  
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
