import { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Applications = () => {

    const { user } = useUser()
    const { getToken } = useAuth()

    const [isEdit, setIsEdit] = useState(false)
    const [resume, setResume] = useState(null)

    const {
        backendUrl,
        userData,
        userApplications,
        fetchUserData,
        fetchUserApplications
    } = useContext(AppContext)

    // Update Resume
    const updateResume = async () => {
        try {

            if (!resume) {
                return toast.error('Please select a resume first')
            }

            const formData = new FormData()
            formData.append('resume', resume)

            const token = await getToken()

            const { data } = await axios.post(
                backendUrl + '/api/users/update-resume',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            if (data.success) {
                toast.success(data.message)

                await fetchUserData()

                setIsEdit(false)
                setResume(null)

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.error('Resume upload error:', error)

            toast.error(
                error.response?.data?.message || error.message
            )
        }
    }

    // Fetch applications
    useEffect(() => {
        if (user) {
            fetchUserApplications()
        }
    }, [user])

    return userData ? (
        <>
            <div className="min-h-screen">

                <div className="container mx-auto px-4 py-10">

                    {/* Resume Section */}
                    <div className="mb-10">

                        <h2 className="text-2xl font-semibold mb-4">
                            Your Resume
                        </h2>

                        {isEdit || userData.resume === "" ? (

                            <div className="flex items-center gap-4">

                                <label
                                    htmlFor="resumeUpload"
                                    className="border border-gray-300 rounded-lg px-4 py-3 cursor-pointer"
                                >
                                    {resume ? resume.name : "Select Resume"}
                                </label>

                                <input
                                    id="resumeUpload"
                                    onChange={(e) =>
                                        setResume(e.target.files[0])
                                    }
                                    accept="application/pdf"
                                    type="file"
                                    hidden
                                />

                                <button
                                    onClick={updateResume}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                                >
                                    Save
                                </button>

                            </div>

                        ) : (

                            <div className="flex items-center gap-4">

                                <a
                                    href={userData.resume}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    View Resume
                                </a>

                                <button
                                    onClick={() => setIsEdit(true)}
                                    className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
                                >
                                    Edit
                                </button>

                            </div>

                        )}

                    </div>


                    {/* Applied Jobs */}
                    <div>

                        <h2 className="text-2xl font-semibold mb-5">
                            Jobs Applied
                        </h2>

                        <div className="overflow-x-auto">

                            <table className="w-full text-left">

                                <thead>
                                    <tr className="border-b">

                                        <th className="py-3">
                                            Company
                                        </th>

                                        <th className="py-3">
                                            Job Title
                                        </th>

                                        <th className="py-3">
                                            Location
                                        </th>

                                        <th className="py-3">
                                            Date
                                        </th>

                                        <th className="py-3">
                                            Status
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {userApplications.map((job, index) => (

                                        <tr
                                            key={index}
                                            className="border-b"
                                        >

                                            <td className="py-4">
                                                {job.companyId?.name}
                                            </td>

                                            <td className="py-4">
                                                {job.jobId?.title}
                                            </td>

                                            <td className="py-4">
                                                {job.jobId?.location}
                                            </td>

                                            <td className="py-4">
                                                {moment(job.date).format('ll')}
                                            </td>

                                            <td className="py-4">

                                                <span
                                                    className={`px-4 py-1.5 rounded ${
                                                        job.status === 'Accepted'
                                                            ? 'bg-green-100'
                                                            : job.status === 'Rejected'
                                                                ? 'bg-red-100'
                                                                : 'bg-blue-100'
                                                    }`}
                                                >
                                                    {job.status}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

            <Footer />
        </>

    ) : null
}

export default Applications