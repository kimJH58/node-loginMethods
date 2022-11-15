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

module.exports = router;