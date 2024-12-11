import { Router, Request, Response } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { validateToken } from '../middleware/validateToken'

const router: Router = Router()

type IUser ={
    email: string
    password: string
}

const userList: IUser[] = []

router.post("/api/user/register", 
    body('email').escape(),
    body('password').escape(),
    async (req: Request, res: Response): Promise<void> => {
        const errors: Result<ValidationError> = validationResult(req)
        
        if (!errors.isEmpty()) {
            console.log(errors)
            res.status(400).json({ errors: errors.array() })
            return
        }
        
        try {
            const existingUser: IUser | undefined = userList.find(user => user.email === req.body.email)
            console.log(existingUser)

            if (existingUser) {
                res.status(403).json({ message: "User already exists" })
                return
            }

            const salt: string = bcrypt.genSaltSync(10)
            const hashedPassword: string = bcrypt.hashSync(req.body.password, salt)
            
            const user: IUser = {
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

router.get("/api/user/list", (req: Request, res: Response): void => {
    try {
        res.json(userList)
    } catch (error) {
        console.log("Error during fetching users: ", error)
        res.status(500).json({ message: "Server error" })
    }
})

router.post("/api/user/login", 
    body("email").escape(), 
    body("password").escape(), 
    async (req: Request, res: Response): Promise<void> => {
        const errors: Result<ValidationError> = validationResult(req)
        
        if (!errors.isEmpty()) {
            console.log(errors)
            res.status(400).json({ errors: errors.array() })
            return
        }

        try {
            const user: IUser | undefined = userList.find(user => user.email === req.body.email)
            console.log(user)

            if (!user) {
                res.status(403).json({ message: "User not found" })
                return
            }

            if (bcrypt.compareSync(req.body.password, user.password)) {
                const jwtPayload: JwtPayload = {
                    email: user.email,
                    password: user.password
                }
                const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: '2m' })
                res.status(200).json({ success: true, token: token })
                return
            } else {
                res.status(403).json({ message: "Invalid credentials" })
            }
        } catch (error: any) {
            console.error(`Error during user login: ${error}`)
            res.status(500).json({ error: 'Internal Server Error' })
            return 
        }
    }
)

router.get("/api/private", validateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({ message: "This is protected secure route!" })
    } catch (error: any) {
        console.log("Error during fetching users: ", error)
        res.status(500).json({ message: "Server error" })
    }
})


router.get('/', (req, res) => {
   
});

export default router