import { Request, Response, Router } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User, IUser } from '../models/User'
//import { validateToken } from '../middleware/validateToken'

const router: Router = Router()

const userList: Partial<IUser>[] = []

router.post("/api/user/register", 
    body('email').escape(),
    body('password').escape(),
    async (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req)
        
        if (!errors.isEmpty()) {
            console.log(errors)
            res.status(400).json({ errors: errors.array() })
            return
        }
        
        try {
            const existingUser: Partial<IUser> | undefined = userList.find(user => user.email === req.body.email)
            console.log(existingUser)

            if (existingUser) {
                res.status(403).json({ message: "User already exists" })
                return
            }

            const salt: string = bcrypt.genSaltSync(10)
            const hashedPassword: string = bcrypt.hashSync(req.body.password, salt)
            
            const user: Partial<IUser> = {
                email: req.body.email,
                password: hashedPassword
            }

            userList.push(user)
            console.log("User added to list: ", user)

            res.status(200).json(user)

        } catch (error) {
            console.log("Error during registration: ", error)   
            const errorMessage = (error instanceof Error) ? error.message : 'Unknown error'
            res.status(500).json({ message: "Server error", error: errorMessage })
        }
    }
)



router.get("/api/user/list", (req: Request, res: Response) => {
    try {
        res.json(userList)
    } catch (error) {
        console.log("Error during fetching users: ", error)
        res.status(500).json({ message: "Server error" })
    }
})




export default router