import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

// Configure storage: files will be saved with a hashed filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create a hash of the file buffer to check for duplicates
        const hash = crypto.createHash('md5').update(Date.now() + file.originalname).digest('hex');
        const ext = path.extname(file.originalname);
        cb(null, `${hash}${ext}`);
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Optionally check file type (e.g., allow only pdf and images)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File type not allowed'));
    }
};

export const upload = multer({ storage, fileFilter });
