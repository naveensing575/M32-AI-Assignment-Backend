import multer from "multer";

const storage = multer.memoryStorage(); // holds in RAM before upload
const upload = multer({ storage });

export default upload;
