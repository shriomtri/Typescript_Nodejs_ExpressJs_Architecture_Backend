import { model, Schema, Document } from 'mongoose';

export const DOCUMENT_NAME = 'TokenStore'
export const COLLECTION_NAME = 'tokens'

export default interface Token extends Document {
    userId: string,
    token: string,
    updatedAt?: Date;
    createdAt?: Date;
}

const schema = new Schema(
    {
        userId: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            maxlength: 100,
        },
        token: {
            type: Schema.Types.String,
            required: true,
            unique: true
        },
        createdAt: {
            type: Date,
            required: true,
            select: false,
        },
        updatedAt: {
            type: Date,
            required: true,
            select: false,
        },
    },
    {
        versionKey: false,
    },
);

export const TokenModel = model<Token>(DOCUMENT_NAME, schema, COLLECTION_NAME);
