import User, {UserModel} from "../model/User";
import Role, {RoleModel} from "../model/Role";
import {InternalError} from "../../core/ApiError";
import Jwt from "../../core/Jwt";

export default class UserRepo {


    public static findByEmail(email: string): Promise<User> {
        return UserModel.findOne({email: email, status: true})
            .select('+email +password +roles')
            .populate({
                path: 'roles',
                match: {status: true},
                select: {code: 1},
            })
            .lean<User>()
            .exec();
    }

    public static async create(
        user: User,
        roleCode: string,
    ): Promise<User> {

        const now = new Date()

        const role = await RoleModel.findOne( {code: roleCode})
            .select('+email +password')
            .lean<Role>()
            .exec()

        if(!role) throw new InternalError('Role must be defined')

        user.roles = [role._id]
        user.createdAt = now
        user.updatedAt = now

        user.token = Jwt.generateToken(user)

        if(!user.token) throw new InternalError('Unable to create user token')

        return await UserModel.create(user)
    }

}