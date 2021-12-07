import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v: string) => {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
            },
            message: (props: any) => `${props.value} is not a valid email`
        }
    },
    pseudo: { type: String, required: [true, 'Pseudo is required'], unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        default: 'USER',
        enum: {
            values: ['USER', 'AUTHOR', 'ADMIN'],
            message: '{VALUE} is not allowed'
        }
    },
    articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }]
}, {
    timestamps: true
});

UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(8, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

export const User = model('User', UserSchema);