import express from "express";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import fs from "fs";

const secret = speakeasy.generateSecret({ name: "MyProduct" });

const app = express();

qrcode.toDataURL(secret.otpauth_url, (err, data) => {
  if (err) throw err;
  app.get("/", (req, res) => {
    const html = fs.readFileSync("./index.html", "utf8");
    res.send(html.replace("QR_CODE_DATA_URL", data));
  });
});

app.get("/verify", (req, res) => {
  const token = req.query.token;
  const verified = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: "base32",
    token: token,
  });
  res.send({
    verified,
    message: verified ? "Token is valid" : "Token is invalid",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
