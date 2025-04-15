import async from 'async';
import Express, { Request, Response } from 'express';
import mongoose, { mongo } from 'mongoose';
import crypto from 'crypto';
import Question from '../models/question';
import Answer from '../models/answer';

const router = Express.Router();

interface QuestionInterface {
    question: string;
    answers: AnswerInterface[];
}

interface AnswerInterface {
    answer: string;
}

interface QueryID {
    id: string | number | mongoose.Types.ObjectId;
}

interface UserAnswer {
    username: string;
    answer: number;
    question_id: string | number | mongoose.Types.ObjectId;
}

router.get('/', (req: Request, res: Response) => {
    res.json({
        TEXT:"HELLO WORLD"
    })
})

// Get question and answers
router.get('/:id', (req: Request, res: Response) => {
    const query: QueryID = req.params;

    if (!query.id) {
        res.httpError(404);
    } else {
        if (!mongoose.Types.ObjectId.isValid(query.id)) {
            res.httpError(404);
        } else {
            async.parallel([
                callback => {
                    Question.findById(query.id, (error, question) => {
                        if (error) {
                            callback(error);
                        } else if (!question) {
                            res.httpError(404);
                        } else {
                            callback(null, question);
                        }
                    });
                },
                callback => {
                    Answer.find({ question_id: query.id}, (error, answers) => callback(error, answers || []));
                }
            ], (error, data: any) => {
                if (error) {
                    res.httpError(500);
                } else {
                    res.json({
                        question: data[0],
                        answers: data[1]
                    });
                }
            });
        }
    }
});

// Add new question
router.post('/', (req: Request, res: Response) => {
    const form: QuestionInterface = req.body;
    console.log("Kasi asac")
    async.series([
        callback => {
            if ((!form.question) || form.question.trim().length === 0) {
                callback(new Error('Fill in the field "Question".'));
            } else {
                callback(null);
            }
        },
        callback => {
            if ((!form.answers) || form.answers.length < 2) {
                callback(new Error('Enter at least 2 answer choices.'));
            } else {
                async.each(form.answers, (element, cb) => {
                    if (element.answer.length === 0) {
                        cb(new Error('The answer field cannot be empty.'));
                    } else {
                        cb(null);
                    }
                }, error => callback(error));
            }
        }
    ], error => {
        if (error) {
            res.httpError(400, error.message);
        } else {
            const answers = form.answers.map(answers => answers.answer);
            const question = new Question({
                question: form.question,
                answers
            });

            question.save((err, doc) => {
                if (err) {
                    res.httpError(500);
                } else {
                    res.json(doc);
                }
            });
        }
    });

});

// User answer to the question
router.post('/:id', (req: Request, res: Response) => {
    const queryID: QueryID = req.params;
    const userAnswer: UserAnswer = req.body;

    let token = req.headers.authorization;

    async.waterfall([
        (callback: any) => {
            if ((!userAnswer.username) || userAnswer.username.trim().length === 0) {
                res.httpError(400, 'Enter your name');
            } else {
                callback(null);
            }
        },
        (callback: any) => {
            if (((!userAnswer.answer) && userAnswer.answer !== 0) || typeof userAnswer.answer !== 'number') {
                res.httpError(400, 'Enter your answer');
            } else {
                callback(null);
            }
        },
        (callback: any) => {
            if (!mongoose.Types.ObjectId.isValid(queryID.id)) {
                res.httpError(404);
            } else {
                Question.findById(queryID.id, (error: Error, question: any) => {
                    if (error) {
                        callback(error);
                    } else {
                        if (question.answers.length < userAnswer.answer || userAnswer.answer < 0) {
                            res.httpError(400, 'Select one of the suggested answers.');
                        } else {
                            callback(null, question);
                        }
                    }
                });
            }
        },
        (question: any, callback: any) => {
            if (!token) {
                callback(null, question);
            } else {
                Answer.findOne({ question_id: question._id, token }, (error, answer) => {
                    if (error) {
                        callback(error);
                    } else {
                        if (answer) {
                            res.httpError(403, 'You have already answered this question.');
                        } else {
                            callback(null, question);
                        }
                    }
                });
            }
        },
        (question: any, callback: any) => {
            token = createToken();

            new Answer({
                question_id: question._id,
                username: userAnswer.username,
                answer: userAnswer.answer,
                token: token
            }).save((error, answer) => {
                if (error) {
                    res.httpError(500);
                } else {
                    callback(null);
                }
            })
        }
    ], error => {
        if (error) {
            res.httpError(500);
        } else {
            res.json({ token });
        }
    });
});


const createToken = () => {
    return crypto.createHmac('sha1', new Date().toString()).update(Math.random().toString()).digest('hex');
};

export default router;