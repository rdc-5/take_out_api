const express = require('express')
const key = require('../../../util/mysql/key')
const router = express.Router()


// 商家注册
router.post('/reg', (req, res, next)=>{
    const io = req.app.locals.io
    const obj = req.body
    const sql = `INSERT INTO merchant VALUES(null, '${obj.m_name}', '${obj.m_iphone}', '${obj.m_account}', '${obj.m_pwd}')`
    const select = `select m_account from merchant where m_iphone='${obj.m_iphone}' or m_account='${obj.m_account}'`
    key.query(select, (err, result)=>{
        if(err) return next(err)
        if(result.length === 0) {
            key.query(sql, (err, result)=>{
                if(err) return next(err)
                res.send({
                    meta: {
                        status: 200,
                        msg: '注册成功'
                    }
                })
                let sqlMerchant = 'select m_id from merchant'
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
        }else {
            res.send({
                meta: {
                    status: 201,
                    msg: '用户名或密码重复'
                }
            })
            return
        }
        
    })
})


// 商家登录
router.post('/login', (req, res, next)=>{
    const obj = req.body
    const sql = 'select m_id from merchant where (m_account=? or m_iphone=?) and m_pwd=?'
    key.query(sql, [obj.username,obj.username, obj.pwd], (err, result)=>{
        if(err) return next(err)
        if(result.length !== 1) {
            res.send({
                meta:{
                    status: 201,
                    msg: '用户名或密码错误'
                }
            })
            return
        }
        res.send({
            data: {
                mid: result[0].m_id
            },
            meta: {
                status: 200,
                msg: '登录成功'
            }
        })
    })
})

// // 申请上店铺上架
// router.post('/ground', (req, res, next)=>{
//     // 引入 socket
//     const io = req.app.locals.io
//     io.on('upload', data=>{
//         res.send(data)
//     })
//     // const obj = req.body
//     // const sql = 'insert into merinfo set ?'
//     // key.query()
// })




module.exports = router