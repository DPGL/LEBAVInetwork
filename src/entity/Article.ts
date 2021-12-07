import { model, Schema } from 'mongoose';

const ArticleSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    author: { type: Schema.Types.ObjectId, required: true, ref: 'User'}
}, {
    timestamps: true
});

export const Article = model('Article', ArticleSchema);