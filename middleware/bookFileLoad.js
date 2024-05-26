const multer = require('multer');

const storage = multer.diskStorage({
    destination(request, file, callbackFunc){
        callbackFunc(null, 'src/images/')
    },
    filename(request, file, callbackFunc) {
        callbackFunc(null, `${Date.now()}-${file.originalname}`)
    }
})
const uploadMiddleware = multer({storage});

module.exports = uploadMiddleware;