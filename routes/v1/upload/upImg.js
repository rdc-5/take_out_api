const router = require('express').Router()
const multer = require('multer')
const fs = require('fs')

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, '../../../public/temp/'+Time())
    },
    filename(req, file, callback) {
        callback(null, Date.now(), file.originalname)
    }
})
const upload = multer({storage})


router.post('/', upload.single('file'), (req, res, next)=>{
    const io = req.app.locals.io
    let path = '../../../public/temp/'+Time()
    if(!fs.existsSync){
        fs.mkdirSync(path, {recursive:true})
    }
    const url = `http://localhost:8888/public/temp/${Time()}/${req.file.filename}`
    res.json({
        url
    })
})

function Time() {
    let data = new Date()
    let y = data.getFullYear()
    let m = data.getMonth()
    let d = data.getDate()
    return `${y}${m+1}${d}`
}
function day() {
    let date = new Date()
    let h = date.getHours()
    let M = date.getMinutes()
    let s = date.getSeconds()
    return `${h}x${M}x${s}`
}

module.exports = router