import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const register = async (req , res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ 
                message: "something is missing",
                succsess: false

             });
        };
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({ 
                message: "User already exists",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email, 
            phoneNumber,
            password : hashedPassword, 
            role
        });
        return res.status(201).json({
            message: "Account created sucessfully",
            success: true
        });

    } catch (error) {
       console.log(error);
    }
}

export const login = async (req , res) => {
    try {
      const { email, password, role } = req.body;
        if(!email || !password || !role) {
            return res.status(400).json({
                message: "something is missing",
                success: false
             });
        
        };
        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                message: "Incorrct email or password",
                success: false
            });
        };
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                message: "Incorrct email or password",
                success: false
            });
        };
        // Check if the role matches
        if(user.role !== role) {
            return res.status(400).json({
                message: "Account does not exist for this role",
                success: false
            });
        };

        const tokenData = {
            userId: user._id,
        }
        const token =await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000, httpsOnly: true, sameSite :'strict'}).json({
            message: `welcome back ${user.fullname}`,
            user,
            success: true,
            token
        });
    }
    catch (error) {
        console.log(error);
    }

}

export const logout = async (req , res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge: 0}).json({
            message: "Logout successful",
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req , res) => {
    try {
        const {fullname,email, phoneNumber, bio, skills} = req.body;
        const file = req.file;
    
        //cloudinary se file upload karna hai
        let skillsArray;
        if(skills) {
            skillsArray = skills.split(',');
        }
         
        const userId = req.userId;// middleware authentication se milega
       
        let user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        // Update user profile
        if(fullname) user.fullname = fullname;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray;
        
        // resume comes later here

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        });

    }
    catch (error) {
        console.log(error);
    }
}