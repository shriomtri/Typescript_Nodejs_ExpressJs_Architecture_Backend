import {NextFunction, Request, Response} from 'express'
import {sign, verify} from 'jsonwebtoken'
import {jwtSecret} from "../config";
import {AccessTokenError, BadTokenError} from "./ApiError";
import User from "../database/model/User";

export default class Jwt {

    public static authenticateToken(req: IUserRequest, res: Response, next: NextFunction) {
        const authHeader = req.header('authorization')
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) {
            throw new BadTokenError('Invalid authorization header')
        }

        verify(token, jwtSecret, ((err, user) => {
            if (err) {
                throw new AccessTokenError()
            } else {
                req.user = user
                next()
            }
        }))
    }

    public static generateToken(user: User): string {
        return sign(user, jwtSecret, {expiresIn: '30 days'})
    }

}

interface IUserRequest extends Request {
    user: any
}