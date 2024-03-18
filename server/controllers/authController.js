const passport = require('passport');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";
const LocalStrategy = require('passport-local').Strategy;


const User = require('../models/User');



function handleErrorsRedirect(req, res, errors, redirectTo) {
    req.flash('error_msg', errors);
    res.redirect(redirectTo);
}

function sendEmail(to, subject, html, cb) {

    const config = {
        email: process.env.EMAIL_ADRESS,
        password: process.env.EMAIL_PASSWORD,
      };
      
      // Créez un objet transporter réutilisable
    const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: config.email,
          pass: config.password,
        },
        port: 587,
    });


    const mailOptions = {
        from: config.email,
        to: to,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, cb);
}

// Fonction pour vérifier les champs obligatoires
function validateFields(nom, prenom, email, password, password2) {
    let errors = [];

    if (!nom || !email || !password || !password2 || !prenom) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }

    return errors;
}

exports.changeMail = async (req, res, nom, prenom, email, oldEmail, password) => {
    const token = jwt.sign({ nom, prenom, email, oldEmail, password }, JWT_KEY, { expiresIn: '30m' });
    const CLIENT_URL = 'http://' + 'localhost:3006'/*req.headers.host*/;

    const output = `
        <h2>Please click on below link to activate your account</h2>
        <p>${CLIENT_URL}/auth/confirm_mail/${token}</p>
        <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
    `;

    sendEmail(email, "Account Verification: NodeJS Auth ✔", output, (error, info) => {
        if (error) {
            console.log(error);
            req.flash('error_msg', 'Something went wrong on our end. Please register again.');
            res.redirect('/monCompte');
        } else {
            console.log('Mail sent : %s', info.response);
            req.flash('success_msg', 'Activation link sent to email ID. Please activate to log in.');
            res.redirect('/monCompte');
        }
    });
}

exports.activateChangeMail = (req, res) => {
    const token = req.params.token;
    let errors = [];

    if (token) {
        jwt.verify(token, JWT_KEY, async (err, decodedToken) => {
            if (err) {
                req.flash('error_msg', 'Incorrect or expired link! Please try again.');
                return res.redirect('/monCompte');
            }

            const { nom, prenom, email, oldEmail, password } = decodedToken;

            try {
                const updatedUser = await User.findOne({ email: oldEmail });

                if (!updatedUser) {
                    req.flash('error_msg', 'User not found.');
                    return res.redirect('/monCompte');
                }

                updatedUser.email = email;

                await updatedUser.save();

                req.flash('success_msg', 'L\'email a été modifié avec succès !');
                res.redirect('/monCompte');
            } catch (error) {
                console.error(error);
                req.flash('error_msg', 'Error updating email.');
                res.redirect('/monCompte');
            }
        });
    } else {
        console.log("Account activation error!");
    }
}


// Fonction pour enregistrer un nouvel utilisateur
async function registerUser(req, res, nom, prenom, email, password) {
    try {
        const user = await User.findOne({ email: email });

        if (user) {
            req.flash('error_msg', 'Email ID already registered');
            return res.redirect('/auth/register');
        }

        const token = jwt.sign({ nom, prenom, email, password }, JWT_KEY, { expiresIn: '30m' });
        const CLIENT_URL = 'http://' + req.headers.host;

        const output = `
            <h2>Please click on below link to activate your account</h2>
            <p>${CLIENT_URL}/auth/activate/${token}</p>
            <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
        `;

        sendEmail(email, "Account Verification: NodeJS Auth ✔", output, (error, info) => {
            if (error) {
                console.log(error);
                req.flash('error_msg', 'Something went wrong on our end. Please register again.');
                res.redirect('/auth/login');
            } else {
                console.log('Mail sent : %s', info.response);
                req.flash('success_msg', 'Activation link sent to email ID. Please activate to log in.');
                res.redirect('/auth/login');
            }
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Something went wrong. Please try again later.');
        res.redirect('/auth/login');
    }
}

exports.registerHandle = async (req, res) => {
    const { nom, prenom, email, password, password2 } = req.body;

    const errors = validateFields(nom, prenom, email, password, password2);

    if (errors.length > 0) {
        return res.render('register', {
            errors,
            nom,
            prenom,
            email,
            password,
            password2
        });
    }

    await registerUser(req, res, nom, prenom, email, password);
}


exports.activateHandle = (req, res) => {
    const token = req.params.token;
    let errors = [];

    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                req.flash('error_msg', 'Incorrect or expired link! Please register again.');
                res.redirect('/auth/register');
            } else {
                const { nom, prenom, email, password } = decodedToken;
                User.findOne({ email: email }).then(user => {
                    if (user) {
                        req.flash('error_msg', 'Email ID already registered! Please log in.');
                        res.redirect('/auth/login');
                    } else {
                        const newUser = new User({ nom, prenom, email, password });
                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser.verified = true;
                                newUser.save()
                                    .then(user => {
                                        req.flash('success_msg', 'Account activated. You can now log in.');
                                        res.redirect('/auth/login');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }
        })
    } else {
        console.log("Account activation error!")
    }
}

exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    let errors = [];

    if (!email) {
        errors.push({ msg: 'Please enter an email ID' });
    }

    if (errors.length > 0) {
        res.render('forgot', {
            errors,
            email
        });
    } else {
        User.findOne({ email: email }).then(user => {
            if (!user) {
                errors.push({ msg: 'User with Email ID does not exist!' });
                res.render('forgot', {
                    errors,
                    email
                });
            } else {
                const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/auth/forgot/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
                `;

                User.updateOne({ resetLink: token }, (err, success) => {
                    if (err) {
                        errors.push({ msg: 'Error resetting password!' });
                        res.render('forgot', {
                            errors,
                            email
                        });
                    } else {
                        sendEmail(email, "Account Password Reset: NodeJS Auth ✔", output, (error, info) => {
                            if (error) {
                                console.log(error);
                                req.flash('error_msg', 'Something went wrong on our end. Please try again later.');
                                res.redirect('/auth/forgot');
                            } else {
                                console.log('Mail sent : %s', info.response);
                                req.flash('success_msg', 'Password reset link sent to email ID. Please follow the instructions.');
                                res.redirect('/auth/login');
                            }
                        });
                    }
                });
            }
        });
    }
}

exports.gotoReset = (req, res) => {
    const { token } = req.params;

    if (token) {
        jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
            if (err) {
                req.flash('error_msg', 'Incorrect or expired link! Please try again.');
                res.redirect('/auth/login');
            } else {
                const { _id } = decodedToken;
                User.findById(_id, (err, user) => {
                    if (err) {
                        req.flash('error_msg', 'User with email ID does not exist! Please try again.');
                        res.redirect('/auth/login');
                    } else {
                        res.redirect(`/auth/reset/${_id}`)
                    }
                })
            }
        })
    } else {
        console.log("Password reset error!")
    }
}

exports.resetPassword = (req, res) => {
    var { password, password2 } = req.body;
    const id = req.params.id;
    let errors = [];

    if (!password || !password2) {
        req.flash('error_msg', 'Please enter all fields.');
        res.redirect(`/auth/reset/${id}`);
    } else if (password.length < 8) {
        req.flash('error_msg', 'Password must be at least 8 characters.');
        res.redirect(`/auth/reset/${id}`);
    } else if (password != password2) {
        req.flash('error_msg', 'Passwords do not match.');
        res.redirect(`/auth/reset/${id}`);
    } else {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(password, salt, (err, hash) => {
                if (err) throw err;
                password = hash;

                User.findByIdAndUpdate(
                    { _id: id },
                    { password },
                    function (err, result) {
                        if (err) {
                            req.flash('error_msg', 'Error resetting password!');
                            res.redirect(`/auth/reset/${id}`);
                        } else {
                            req.flash('success_msg', 'Password reset successfully!');
                            res.redirect('/auth/login');
                        }
                    }
                );
            });
        });
    }
}

exports.authenticateMiddleware = passport.authenticate('local', {
    successRedirect: '/pageCatalogue',
    failureRedirect: '/auth/login',
    failureFlash: true
});

exports.loginHandle = (req, res, next) => {
    exports.authenticateMiddleware(req, res, next);
}

exports.logoutHandle = (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.error(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/auth/login');
    });
}
