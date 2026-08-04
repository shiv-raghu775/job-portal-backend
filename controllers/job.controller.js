import {Job} from "../models/job.model.js";


//admin post karega job
export const postJob = async (req, res)=>{
    try{
       const {title, description, requirements, salary, location,jobType, position, experience , companyId }= req.body;
       const userId = req.userId;
       if(!title || !description || !requirements || !salary || !location || !jobType || !position || !experience || !companyId){
        return res.status(400).json({
            message: "something is missing",
            success: false
        })
       };
       const job = await Job.create({
         title,
         description,
         requirements: requirements.split(','),
         salary:Number(salary),
         location,
         jobType,
         experienceLevel: experience,
         position,
         company: companyId,
         createdBy: userId
       });
       return res.status(201).json({
        message: "Job posted successfully",
        job,
        success: true
        
       });
    }
    catch (error){
        console.log(error);
    }
}
//user get karega job
export const getAllJobs = async (req, res)=>{
    try{
       const keywords = req.query.keywords||"";
       const query={
        $or:[
            {title:{$regex: keywords, $options: "i"}},
            {description:{$regex: keywords, $options: "i"}},
        ]
       };
       const jobs = await Job.find(query).populate({
        path: "company",
       }).sort({createdAt: -1});
        if(!jobs){
            return res.status(404).jason({
                message: "No jobs found",
                success: false
            });
        }
        return res.status(200).json({
            jobs,
            success: true
        })
    }
    
    catch (error){
        console.log(error);
    }
}
//admin get karega job by id
export const getJobById = async (req, res)=>{
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message: "job not found",
                success: false
            })
        };
        return res.status(200).json({job, success: true});
    }
    catch (error){
        console.log(error);
    }
}

//admin abhi tak kitne job create kara hai

export const getAdminJobs = async (req, res)=>{
    try{
        const adminId = req.userId;
        const jobs = await Job.find({createdBy: adminId});
        if(!jobs){
            return res.status(404).json({
                message: "No jobs found",
                success: false
            })
        };
        return res.status(200).json({jobs, success: true});
        

    }catch (error){
        console.log(error);
    }
}

