import {AccessControl} from 'accesscontrol';
import {NextFunction} from "express";
import {IUserRequest} from './Jwt'
import Role from "../database/model/Role";
import {AuthFailureError} from "./ApiError";

class Authorization {

    private static instance: AccessControl

    /*
    * we have different type of users [reader, writer, supervisor, admin ]
    * we have different type of resources [profile, article]
    *
    * */
    private constructor() {

    }

    public static getInstance(): AccessControl {
        if (!Authorization.instance) {
            Authorization.instance = new AccessControl()


            Authorization.instance.grant("reader")
                .readOwn("profile")
                .updateOwn("profile")
                .readAny('article')

            Authorization.instance.grant('writer')
                .extend('reader')
                .updateOwn('article')

            Authorization.instance.grant('supervisor')
                .extend('writer')
                .createAny('article')
                .readAny('profile')
                .updateAny('article')

            Authorization.instance.grant("admin")
                .extend("supervisor")
                .createAny('profile')
                .updateAny("profile")
                .deleteAny("profile")
                .deleteAny('article')

        }
        return Authorization.instance
    }

    public static grantAccess(action: string, resource: string) {
        return async (request: IUserRequest, response: Response, nextFunction: NextFunction) => {
            try {
                // @ts-ignore
                const permission = Authorization.instance.can(request.user.roles)[action](resource)
                if (permission.granted) {
                    nextFunction()
                } else {
                    throw new AuthFailureError('Permission denied')
                }
            } catch (error) {
                throw new AuthFailureError('Permission denied')
            }
        }
    }

}


export default {
    Authorization: Authorization.getInstance(),
    grantAccess: Authorization.grantAccess
}