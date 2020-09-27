import {Schema, model, Document} from "mongoose";
import User from './User'

export const DOCUMENT_NAME = 'Blog'
export const COLLECTION_NAME = 'blogs'

export default interface Blog extends Document {
    title: string;
    smallDescription: string;
    longDescription: string;
    text?: string;
    draftText: string;
    tags: string[];
    author: User;
    imagUrl?: string;
    blogUrl: string;
    likes?: number;
    views: number;
    slug: string
    isSubmitted: boolean;
    isDraft: boolean;
    isPublished: boolean;
    status?: boolean;
    publishedAt?: Date;
    createdBy?: User;
    updatedBy?: User;
    createdAt?: Date;
    updatedAt?: Date;
}

const schema = new Schema(
    {
        title: {
            type: Schema.Types.String,
            required: true,
            maxlength: 10,
            trim: true,
        },
        smallDescription: {
            type: Schema.Types.String,
            required: true,
            maxlength: 200,
            trim: true,
        },
        longDescription: {
            type: Schema.Types.String,
            required: true,
            maxlength: 5000,
            trim: true,
        },
        text: {
            type: Schema.Types.String,
            required: false,
            select: false,
        },
        draftText: {
            type: Schema.Types.String,
            required: true,
            select: false,
        },
        tags: [
            {
                type: Schema.Types.String,
                trim: true,
                uppercase: true,
            },
        ],
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        imgUrl: {
            type: Schema.Types.String,
            required: false,
            maxlength: 500,
            trim: true,
        },
        blogUrl: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            maxlength: 200,
            trim: true,
        },
        likes: {
            type: Schema.Types.Number,
            default: 0,
        },
        views: {
            type: Schema.Types.Number,
            default: 0,
        },
        slug: {
            type: Schema.Types.String,
            required: true,
            maxlength: 500,
            trim: true,
        }, isSubmitted: {
            type: Schema.Types.Boolean,
            default: false,
            select: false,
            index: true,
        },
        isDraft: {
            type: Schema.Types.Boolean,
            default: true,
            select: false,
            index: true,
        },
        isPublished: {
            type: Schema.Types.Boolean,
            default: false,
            select: false,
            index: true,
        },
        publishedAt: {
            type: Schema.Types.Date,
            required: false,
            index: true,
        },
        status: {
            type: Schema.Types.Boolean,
            default: true,
            select: false,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            select: false,
            index: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            select: false,
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
).index(
    {title: 'text', description: 'text'},
    {weights: {title: 3, description: 2, tags: 1}, background: false}
);

export const BlogModel = model<Blog>(DOCUMENT_NAME, schema, COLLECTION_NAME)