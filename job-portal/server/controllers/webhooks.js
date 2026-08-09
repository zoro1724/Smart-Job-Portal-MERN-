import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
    try {

        // Create a Svix instance with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // Verifying Headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        // Getting Data from request body
        const { data, type } = req.body

        // Switch Cases for differernt Events
        switch (type) {
            // case 'user.created': {

            //     const userData = {
            //         _id: data.id,
            //         email: data.email_addresses[0].email_address,
            //         name: data.first_name + " " + data.last_name,
            //         image: data.image_url,
            //         resume: ''
            //     }
            //     await User.create(userData)
            //     res.json({})
            //     break;
            // }

            case 'user.created': {

                console.log("USER CREATED EVENT RECEIVED");
                console.log("Clerk User ID:", data.id);
                console.log("Email:", data.email_addresses?.[0]?.email_address);

                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                }

                console.log("USER DATA TO SAVE:", userData);

                const newUser = await User.create(userData);

                console.log("USER SAVED TO MONGODB:", newUser);

                res.json({ success: true });
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }
            default:
                break;
        }

    } catch (error) {
    console.error("WEBHOOK ERROR:", error);

    res.status(400).json({
        success: false,
        message: error.message
    });
}
}