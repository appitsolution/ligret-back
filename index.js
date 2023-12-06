const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

var jsonParser = bodyParser.json();

app.post("/add", jsonParser, async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length !== 3) {
      return res.json({ code: 400, message: "arguments is not correct" });
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();

    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "11OE-N_McAS-Zxv5oGwtTY8jySSgyIkFsGSA8yK2aD64";

    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "List1!A:A",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [req.body],
      },
    });

    res.json({
      code: 201,
      message: "ok",
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 500,
      message: err,
    });
  }
});

app.listen(3000, (req, res) => console.log("running on 3000"));
