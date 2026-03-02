import multer from 'multer';

// Keep the file in memory (RAM), not on disk
const storage = multer.memoryStorage();

export const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // Limit to 2MB to keep DB healthy
});