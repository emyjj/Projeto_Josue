const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de tamanho do arquivo (5MB)
    fileFilter: (req, file, cb) => {
        if (EXTENSOES[file.mimetype]) return cb(null, true);
        cb(new Error('Tipo de arquivo não permitido'));
    },
});