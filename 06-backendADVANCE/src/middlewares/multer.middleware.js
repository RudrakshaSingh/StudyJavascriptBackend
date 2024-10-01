import multer from "multer";

//returns file.originalname
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "./public/temp"); //destination temp file
   },
   filename: function (req, file, cb) {
      cb(null, file.originalname);
   },
});

export const upload = multer({ storage });
//cb is callback
