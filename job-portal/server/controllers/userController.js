import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"

// Get User Data
export const getUserData = async (req, res) => {

    const userId = req.auth.userId

    try {

        const user = await User.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }

        res.json({ success: true, user })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}


// Apply For Job
export const applyForJob = async (req, res) => {

    const { jobId } = req.body

    const userId = req.auth.userId

    try {

        const isAlreadyApplied = await JobApplication.find({ jobId, userId })

        if (isAlreadyApplied.length > 0) {
            return res.json({ success: false, message: 'Already Applied' })
        }

        const jobData = await Job.findById(jobId)

        if (!jobData) {
            return res.json({ success: false, message: 'Job Not Found' })
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({ success: true, message: 'Applied Successfully' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Get User Applied Applications Data
export const getUserJobApplications = async (req, res) => {

    try {

        const userId = req.auth.userId

        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec()

        if (!applications) {
            return res.json({ success: false, message: 'No job applications found for this user.' })
        }

        return res.json({ success: true, applications })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Update User Resume
export const updateUserResume = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const resumeFile = req.file;

        if (!resumeFile) {
            return res.status(400).json({
                success: false,
                message: "No resume file received"
            });
        }

        const userData = await User.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        const resumeUpload = await cloudinary.uploader.upload(
            resumeFile.path,
            {
                resource_type: "raw",
                use_filename: true,
                unique_filename: true,
                type: "upload"
            }
        );

        console.log("Original filename:", resumeFile.originalname);
        console.log("Uploaded URL:", resumeUpload.secure_url);
        console.log("Public ID:", resumeUpload.public_id);
        console.log("Resource type:", resumeUpload.resource_type);
        console.log("Format:", resumeUpload.format);

        userData.resume = resumeUpload.secure_url;
        await userData.save();

        return res.json({
            success: true,
            message: "Resume Updated",
            resume: userData.resume
        });

    } catch (error) {
        console.error("RESUME ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};