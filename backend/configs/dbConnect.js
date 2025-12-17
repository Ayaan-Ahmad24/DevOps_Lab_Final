const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // Optional: Enable SSL/TLS encryption if required by your MongoDB server
            // ssl: true, 
            // Optional: Additional options for SSL/TLS
            // sslValidate: false,
            // sslCA: [path_to_your_CA_certificate], // Use this if you have a custom CA certificate
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1); // Exit the process with a failure code
    }
};

// Handle connection state changes
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to the database');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from the database');
});

module.exports = dbConnect;
