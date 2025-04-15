// import mongoose from 'mongoose';
// import {environment} from '../environments/environment';

// // const connect: Promise<typeof mongoose> = mongoose.connect(environment.mongoose.uri, environment.mongoose.options);

// // const connection = mongoose.connection;

// function retryconnect (){
//     let check = setInterval(()=>{
    
//     const connect: Promise<typeof mongoose> = mongoose.connect(environment.mongoose.uri, environment.mongoose.options);

//     const connection = mongoose.connection;
// if (connection){clearInterval(check)}
// },5000)}
// // export default {connect, connection};
// export default {retryconnect};

import mongoose from 'mongoose';
import { environment } from '../environments/environment';

const retryconnect = (callback: (error?: Error | null) => void) => {
    const connect = () => {
        mongoose
            .connect(environment.mongoose.uri, environment.mongoose.options)
            .then(() => {
                console.log('✅ MongoDB connected');
                callback(null);
            })
            .catch((err) => {
                console.error('❌ MongoDB connection failed, retrying in 3s:', err.message);
                setTimeout(connect, 3000);
            });
    };

    connect();
};

const connection = mongoose.connection;

export default { retryconnect, connection };