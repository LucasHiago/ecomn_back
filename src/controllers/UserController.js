const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    async store(req, res){
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        
        if (!user){
            const hashedPassword = await bcrypt.hash(password, 10);
            
            user = await User.create({ email, password: hashedPassword });
        }

        user.password = undefined;
        return res.json(user);
    },
    async login(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ errors: [ 'O e-mail não foi encontrado!']});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ errors: ['Senha inválida.']})
        }

        const payload = {
            id: user.id, 
            email: user.email
        };

        const token = jwt.sign(payload, process.env.SECRET || "s3cr3t", {
            expiresIn: "7d"
        });

        return res.json({
            token,
            ...payload
        });
    }
};