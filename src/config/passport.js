const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/User');
const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET || "s3cr3t";

exports.jwtAuthentication = new JwtStrategy(opts, function(jwtPayload, done) {
    User.findOne({ email: jwtPayload.email})
        .then(user => {
            if (user) {
                return done(null, user);
            }

            return done(null, false);
        })
        .catch(err => {
            return done(err, false);
        });
});