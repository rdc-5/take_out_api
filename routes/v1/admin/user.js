const express = require('express')
const token = require('../../../util/modules/token')
const key = require('../../../util/mysql/key')
const router = express.Router()


/* 管理员登录 */
router.post('/login', (req, res, next)=>{
    let obj = req.body
    const io = req.app.locals.io
    let sql = 'select aid from admin where aname=? and apwd=?'
    key.query(sql, [obj.username, obj.userpwd], (err, result)=>{
        if(err){
            next(err)
            return
        }  
        if(result.length!==1){
            res.send({meta:{status:201, msg: '用户或密码错误'}})
            return
        }
        res.send({
            data:{
                uname: obj.username,
                token: token(obj.uname)
            },
            meta:{
                status: 200,
                msg: '登录成功'
            }
        })
        req.header("mytoken",token(obj.uname))
                let sqlMerchant = 'select * from merchant'
                let sqlUser = 'select * from users'
                key.query(sqlMerchant, (err, Merchant)=>{
                    if(err) return next(err)
                    key.query(sqlUser, (err, User)=>{
                        if(err) return next(err)
                        let merchant = Merchant.length
                        let user = User.length
                        let obj = {
                            merchant: merchant,
                            user: user
                        }
                        io.emit('values', obj)
                    })
                
        })
    })
})

module.exports = router