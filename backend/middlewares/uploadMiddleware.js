const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    try {
        // If no file is uploaded, allow the request to proceed
        if (!file) {
            cb(null, true);
            return;
        }

        if (!file.mimetype) {
            cb(new Error('No file type detected'), false);
            return;
        }

        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    } catch (error) {
        cb(error, false);
    }
};

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({ message: 'File is too large. Maximum size is 5MB' });
        } else {
            res.status(400).json({ message: err.message });
        }
    } else if (err) {
        res.status(400).json({ message: err.message });
    } else {
        next();
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = { upload, handleMulterError };
