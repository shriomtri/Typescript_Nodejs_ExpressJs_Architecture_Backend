import User, {UserModel} from "../model/User";
import Role, {RoleModel} from "../model/Role";
import {InternalError} from "../../core/ApiError";
import Jwt from "../../core/Jwt";
import TokenRepo from "./TokenRepo";
import Token, {TokenModel} from "../model/Token";

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
    ): Promise<{ user: User, token: string }> {

        const now = new Date()

        const role = await RoleModel.findOne({code: roleCode})
            .lean<Role>()
            .exec()

        if (!role) throw new InternalError('Role must be defined')

        user.roles = [role]
        user.createdAt = now
        user.updatedAt = now

        //create user
        const createdUser = await UserModel.create(user)

        //create user token
        let jwtToken = Jwt.generateToken(createdUser);

        if (!jwtToken) {
            await UserModel.remove({_id: createdUser._id})
            throw new InternalError('Unable to create user token')
        }

        //save token to token collection
        let tokenStore = await TokenRepo.createToken({
            userId: createdUser._id,
            token: jwtToken
        } as Token)

        if(!tokenStore) {
            throw new InternalError('Unable to create token in token store')
        }

        return { ...createdUser.toJSON() , token: jwtToken}
    }

}