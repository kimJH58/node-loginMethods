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



module.exports = router;