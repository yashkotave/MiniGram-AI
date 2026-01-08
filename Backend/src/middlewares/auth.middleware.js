const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');


const authMiddleware = async (req, res, next) => { 
      const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                message: 'Unauthorized access,please login first'});

        }
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await userModel.findOne({
                _id: decoded.id
            });   
            req.user = user;
            next();
        }catch(err){
            return res.status(401).json({
                message: 'Invalid token please login again'});
        }    

        res.json({
            message: 'You are authorized to access this route',
            user: decoded.username
        });
}


module.exports = authMiddleware;