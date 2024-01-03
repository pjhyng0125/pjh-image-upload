require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const mongoose = require("mongoose");
const image = require("./models/image");
// const image = mongoose.model("image");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  // filename: (req, file, cb) => cb(null, file.originalname),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("invalid File Type"), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const app = express();
const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongodb connected.");
    // 특정 디렉토리만 public 공개
    app.use("/uploads", express.static("uploads"));

    app.post("/uploads", upload.single("imageTest"), async (req, res) => {
      // 강제 서버 오류 발생
      // return res.status(500).json({ error: "server fail" });

      const imageInfo = await new image({
        key: req.file.filename,
        originFileName: req.file.originalname,
      }).save();
      res.json(imageInfo);
    });

    // 이미지 조회
    app.get("/images", async (req, res) => {
      const images = await image.find();
      res.json(images);
    });

    app.listen(PORT, () =>
      console.log("Express server listening on PORT (" + PORT + ")")
    );
  })
  .catch((err) => console.log(err));
