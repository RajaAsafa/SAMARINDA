const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/ogg'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error(`Format file tidak didukung: ${file.mimetype}`), false);
};

module.exports = multer({ storage, fileFilter, limits: { fileSize: 500 * 1024 * 1024 } });
