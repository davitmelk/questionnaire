import mongoose from 'mongoose';
import crypto from 'crypto';

const schema = new mongoose.Schema({
    question_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    answer: Number,
    token: String,
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.createToken = () => {
    return crypto.createHmac('sha1', 'dsadas').update('sadsad').digest('hex');
};

export default mongoose.model('Answer', schema);