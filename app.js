const bodyParser = require('body-parser')
const path = require('path')
const mount = require('mount-routes')

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const key = require('./util/mysql/key')
const user = require('./routes/v1/admin/user')
const merUser = require('./routes/v1/merchant/merUser')
// const upload = require('./routes/v1/upload/upImg')

app.all('*',(req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
    res.setHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    next()
})
// 创建服务器

io.on('connection',function(socket) {
    //接收数据
    socket.on('value',function (data) {
        let sqlMerchant = 'select * from merchant'
        let sqlUser = 'select * from users'
        key.query(sqlMerchant, (err, Merchant)=>{
            if(err) return next(err)
            key.query(sqlUser, (err,User)=>{
                if(err) return next(err)
                        let merchant = Merchant.length
                        let user = User.length
                        let obj = {
                            merchant:merchant,
                            user: user
                        }
                        socket.emit('values', obj); 
                    }) 
            });
    })
});
server.listen(8888, _=>{
    console.log('Server is run')
})

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use('/public', express.static(path.join(__dirname+'/public')))
/* 路由自动挂载 */
mount(app, path.join(process.cwd(),'/routes'), true)




app.use('/user', user)
app.use('/merUser', merUser)
// app.use('/upImg', upload)
app.use((req, res, next)=>{
    res.send({
        status: 404,
        msg: '网络出错了'
    })
})


app.locals.io = io