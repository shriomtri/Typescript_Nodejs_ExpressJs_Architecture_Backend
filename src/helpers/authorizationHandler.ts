import {NextFunction, Response} from "express";
import {ForbiddenError} from "../core/ApiError";
import {RoleCode, RoleModel} from "../database/model/Role";
import {IUserRequest} from "../core/Jwt";
import asyncHandler from "./asyncHandler";

export default (roleCode: string[] = [RoleCode.READER]) => asyncHandler(async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user
        const roles = await RoleModel.find({code: {$in: roleCode }}).exec()

        const roleIdArray = roles.map(role => role._id.toString())
        const userRoleIdArray = user.roles

        roleIdArray.forEach((requiredRoleId: string) => {
            if(userRoleIdArray.filter((userRoleId: string) => userRoleId == requiredRoleId).length == 0){
                throw new ForbiddenError()
            }
        })
        next()
    } catch (error) {
        next(error)
    }
})