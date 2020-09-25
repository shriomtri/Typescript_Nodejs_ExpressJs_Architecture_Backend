import Token, {TokenModel} from "../model/Token";


export default class TokenRepo {

    public static async createToken(token: Token): Promise<Token> {

        const now = new Date()
        token.createdAt = now
        token.updatedAt = now

        return await TokenModel.create(token)
    }
}