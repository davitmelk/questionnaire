import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answers: {
        type: [String],
        min: 2
    },
    created: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Question', schema);