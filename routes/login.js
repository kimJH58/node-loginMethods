const express = require('express');
const router = express.Router();
const app = express();
const mysql = require('sync-mysql');
const async = require("async");
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;

require('dotenv').config();

var mysqlConfig = {
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    multipleStatements: true,
    dateStrings: "date",
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
};

var conn = new mysql(mysqlConfig);

/*로그인 성공시 사용자 정보를 Session에 저장한다*/
passport.serializeUser(function (user, done) {
    done(null, user)
});

/*인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.*/
passport.deserializeUser(function (user, done) {
    done(null, user);
});

/* 로컬 로그인 */
passport.use(new LocalStrategy(
    {
        usernameField: 'id',
        passwordField: 'pw'
    }, 
    function(id, pw, done){
        var sql = `SELECT * FROM tbl_user WHERE email='${id}';`;
        conn.query(sql, function(err, rows){
            if(err) throw err;
            /* 아이디를 찾을 수 없음 */
            if(rows.length == 0){
                return done(null, false, {resultCode:500});
            }
            var loginSql = `SELECT * FROM tbl_user WHERE email='${id}' AND password='${pw}';`;
            conn.query(loginSql, function(err, rs){
                if(err) throw err;
                /* 비밀번호 오류 */
                if(rs.length == 0){
                    return done(null, false, {resultCode:600})
                }

                return done(null, {
                    user_id:rs[0].id,
                    user_email:rs[0].email
                });
            })
        })
    }
));

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log('passport.authenticalte callback ');
        if (err) {
            console.error(err);
            return next(err);
        }
        if(info) {
            if (info.resultCode == 500) {
            return res.json({ resultCode: 500, data: 'wrong id' })
            } else if (info.resultCode == 600) {
            return res.json({ resultCode: 500, data: 'wrong password' })
            } 
        }
        return req.login(user, loginErr => {  
            if (loginErr) {
            return next(loginErr);
            }
            return res.json({resultCode:200, data: "login success"});
        });
    })(req, res, next);
});
/**로컬 로그인 끝 */

/**sns 로그인시 정보확인 */
function loginByThirdparty(info, done){
    console.log(info);

    var user = conn.query(`SELECT * FROM tbl_user WHERE ${info.auth_type}='${info.auth_id}';`);
    if(err){
        return done(err);
    }else{
        if(user.length === 0){
            /**신규유저 */
            var insertUser = conn.query(`INSERT INTO tbl_user SET ${info.auth_type}='${info.auth_id}', email='${info.auth_email}';`);
            if(err){
                throw err;
            }else{
                return done(null, {
                    'user_id' : insertUser.insertId,
                    'user_email' : info.auth_email
                })
            }
        }else{
            /**기존유저 */
            return done(null, {
                'user_id' : user[0].id,
                'user_email' : user[0].auth_email
            })
        }
    }
}
/**sns 로그인 정보확인 끝 */

/* 페이스북 로그인 */
passport.use(new FacebookStrategy(
    {
        clientID:'',
        clientSecret:'',
        callbackURL:'/user/login/facebook/callback',
        /* 페이스북에서 갖고 올 정보 */
        profileFields:['id', 'email', 'gender', 'link', 'name', 'verified']
    }, 
    function(accessToken, refreshToken, profile, done){
        const _profile = profile._json;
        console.log(_profile);

        loginByThirdparty({
            'auth_type': 'facebook_uid',
            'auth_id': _profile.id,
            'auth_email':_profile.email
        }, done);
    }
));

router.get('/login/facebook',
    passport.authenticate('facebook')
);

router.get('/login/facebook/callback',
    passport.authenticate('facebook', {
        /* 성공시 */
        successRedirect: '',
        /** 실패시 */
        failureRedirect: ''
    })
);
/**페이스북 로그인 끝 */


module.exports = router;