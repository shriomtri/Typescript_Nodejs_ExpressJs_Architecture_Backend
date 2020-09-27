import Token, {TokenModel} from "../model/Token";


export default class TokenRepo {

    public static async createToken(token: Token): Promise<Token> {

        const now = new Date()
        token.createdAt = now
        token.updatedAt = now

        return await TokenModel.create(token)
    }

    public static async findTokenByUserId(userId: string): Promise<Token> {
        return await TokenModel.findOne({userId: userId});
    }

    public static async findUserIdByToken(token: string): Promise<Token> {
        return await TokenModel.findOne({token: token});
    }

}
