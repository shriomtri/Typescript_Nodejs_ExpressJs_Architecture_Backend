import express, {NextFunction, Request, Response} from 'express'
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import _ from 'lodash';

import validator from "../../../helpers/validator";
import schema from "./schema";
import asyncHandler from "../../../helpers/asyncHandler";
import UserRepo from "../../../database/repository/UserRepo";
import {BadRequestError} from "../../../core/ApiError";
import {RoleCode} from "../../../database/model/Role";
import User from "../../../database/model/User";
import {SuccessResponse} from "../../../core/ApiResponse";

const router = express.Router();

router.post(
    '/basic',
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
            RoleCode.LEARNER
        )

        new SuccessResponse(
            'Signup Successful',
            _.pick(createdUser, ['_id', 'name', 'email', 'roles', 'profilePicUrl', 'token'])
        ).send(res)
    })
)

export default router