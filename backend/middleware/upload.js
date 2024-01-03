var multer = require("multer");
const fs = require("fs");

const checkDirectory = (dir) => {
    fs.stat(dir, function (err) {
        if (!err) {
            // console.log("directory exists");
        } else {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "image") {
            let dir = "public/uploads/";
            checkDirectory(dir);
            cb(null, dir);
        } else if (
            file.fieldname.includes("report_image") ||
            file.fieldname.includes("cover_image")
        ) {
            let dir = "public/uploads/";
            checkDirectory(dir);
            cb(null, dir);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

var uploads = multer({ storage: storage });

module.exports = uploads;
