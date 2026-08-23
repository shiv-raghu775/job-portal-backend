import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next)=>{
    try{

         console.log("COOKIES:", req.cookies);
        console.log("TOKEN:", req.cookies?.token);
        
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message: "Unauthorized access",
                success: false
            })
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded){
            return res.status(401).json({
                message:"Invalid token",
                success: false
            })
        };
        req.userId = decoded.userId;
        next();
    }
    catch (error){
        console.log(error);
        return res.status(401).json({
            message: "Authentication failed",
            success: false
        });
    }
}
export default isAuthenticated;