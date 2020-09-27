import express, {NextFunction, Request, Response} from 'express'
import bcrypt from 'bcrypt';
import _ from 'lodash';

import validator, {ValidationSource} from "../../../helpers/validator";
import schema from "./schema";
import asyncHandler from "../../../helpers/asyncHandler";
import UserRepo from "../../../database/repository/UserRepo";
import {AuthFailureError, BadRequestError, ForbiddenError} from "../../../core/ApiError";
import {SuccessResponse} from "../../../core/ApiResponse";
import TokenRepo from "../../../database/repository/TokenRepo";
import User from "../../../database/model/User";
import Role, {RoleCode, RoleModel} from "../../../database/model/Role";
import Jwt, {IUserRequest} from "../../../core/Jwt";
import {Types} from "mongoose";
import authorizationHandler from "../../../helpers/authorizationHandler";


const router = express.Router();

router.post(
    '/login',
    validator(schema.userCredential),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const user = await UserRepo.findByEmail(req.body.email)
        if (!user) throw new BadRequestError('User not registered');
        if (!user.password) throw new BadRequestError('Credential not set');

        const match = await bcrypt.compare(req.body.password, user.password)
        if (!match) throw new AuthFailureError('Authentication failure')

        const tokenDoc = await TokenRepo.findTokenByUserId(user._id)
        if (!tokenDoc) throw new BadRequestError('User not registered')

        new SuccessResponse(
            'Signup Successful',
            {..._.pick(user, ['_id', 'name', 'email']), ..._.pick(tokenDoc, ['token'])}
        ).send(res)
    })
)

router.post(
    '/signup',
    validator(schema.signup),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const user = await UserRepo.findByEmail(req.body.email)
        if (user) next(new BadRequestError('User already registered'))

        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const createdUser = await UserRepo.create(
            {
                name: req.body.name,
                email: req.body.email,
                profilePicUrl: req.body.profilePicUrl,
                password: passwordHash
            } as User,
            RoleCode.READER
        )

        new SuccessResponse(
            'Signup Successful',
            _.pick(createdUser, ['_id', 'name', 'email', 'token'])
        ).send(res)
    })
)

router.get(
    '/users',
    validator(schema.auth, ValidationSource.HEADER),
    Jwt.authenticateToken,
    authorizationHandler([RoleCode.ADMIN]),
    asyncHandler(async (req: IUserRequest, res: Response, next: NextFunction) => {
        const users = await UserRepo.getUsers()
        new SuccessResponse(
            'SUCCESS',
            [...users]
        ).send(res)
    })
)

export default router