import { model, Schema } from 'mongoose';

const RequestToUserSchema = new Schema({
    toUser:{type: Schema.Types.ObjectId, required: true, ref: 'User'},
    fromUser:{type: Schema.Types.ObjectId, required: true, ref: 'User'},
    accepted: {type: Boolean, default:false}
},{
    timestamps: true
})

export const RequestToUser = model('AddUser', RequestToUserSchema);