import Job from "../models/Job.js"



// Get All Jobs
export const getJobs = async (req, res) => {
    try {

        const jobs = await Job.find({ visible: true })
            .populate({ path: 'companyId', select: '-password' })

        res.json({ success: true, jobs })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Single Job Using JobID
// export const getJobById = async (req, res) => {
//     try {

//         const { id } = req.params

//         const job = await Job.findById(id)
//             .populate({
//                 path: 'companyId',
//                 select: '-password'
//             })

//         if (!job) {
//             return res.json({
//                 success: false,
//                 message: 'Job not found'
//             })
//         }

//         res.json({
//             success: true,
//             job
//         })

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }

export const getJobById = async (req, res) => {
    try {

        const { id } = req.params

        console.log("Job ID:", id)
        console.log("MongoDB readyState:", Job.db.readyState)

        const job = await Job.findById(id)
            .populate({
                path: 'companyId',
                select: '-password'
            })

        console.log("Job found:", !!job)

        if (!job) {
            return res.json({
                success: false,
                message: 'Job not found'
            })
        }

        res.json({
            success: true,
            job
        })

    } catch (error) {
        console.log("GET JOB BY ID ERROR:", error)
        res.json({
            success: false,
            message: error.message
        })
    }
}