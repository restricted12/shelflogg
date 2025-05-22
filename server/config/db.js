
const mongoose = require('mongoose');

const mongoURL = 'mongodb+srv://ezepayooner:32354505@cluster0.dwv8uae.mongodb.net/shelflog?retryWrites=true&w=majority';

// Connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000, // Increased to 15 seconds
    socketTimeoutMS: 60000,         // Increased to 60 seconds
    maxPoolSize: 10,
    minPoolSize: 2,                 // Ensure minimum connections
    bufferCommands: false,          // Explicitly disable buffering
    autoIndex: false,
    connectTimeoutMS: 15000,        // Match server selection timeout
    heartbeatFrequencyMS: 10000,    // Check connection every 10 seconds
    retryWrites: true,
};

// Initialize connection with retry logic
const connectWithRetry = () => {
    mongoose.connect(mongoURL, options)
        .then(() => {
            console.log('MongoDB connected successfully at', new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
        })
        .catch((error) => {
            console.error('MongoDB initial connection failed:', error.message);
            setTimeout(connectWithRetry, 5000); // Retry every 5 seconds
        });
};

connectWithRetry();

const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error.message);
});

db.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
    connectWithRetry();
});

db.once('open', () => {
    console.log('MongoDB connection is open at', new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));
});

// Handle process termination
process.on('SIGINT', () => {
    db.close(() => {
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
});

module.exports = mongoose;
