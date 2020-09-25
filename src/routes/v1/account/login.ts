import express, {NextFunction, Request, Response} from 'express'
import bcrypt from 'bcrypt';
import _ from 'lodash';

import validator from "../../../helpers/validator";
import schema from "../access/schema";
import asyncHandler from "../../../helpers/asyncHandler";
import UserRepo from "../../../database/repository/UserRepo";
import {AuthFailureError, BadRequestError} from "../../../core/ApiError";
import {SuccessResponse} from "../../../core/ApiResponse";
import TokenRepo from "../../../database/repository/TokenRepo";

const router = express.Router();

router.post(
    '/',
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

export default router