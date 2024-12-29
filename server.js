const _express = require('express')
const _dotenv = require('dotenv')
const _mongoose = require('mongoose')
const _swaggerUI  = require('swagger-ui-express')
const _swaggerConfig  = require('./swaggerConfig')

const userRoutes = require('./routes/UserRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const operatorRoutes = require('./routes/OperatorRoutes');

_dotenv.config()

const _app = _express()

//middleware
_app.use(_express.json())

//swagger documentation
_app.use('/api-docs', _swaggerUI.serve, _swaggerUI.setup(_swaggerConfig));

// Users
_app.use('/api/users', userRoutes);

//Admin
_app.use('/api/admin', adminRoutes);

//Operator
_app.use('/api/operator', operatorRoutes);

// Error Middleware
_app.use(require('./middleware/errorMiddleware'));




// MongoDB Connection
_mongoose
.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to DB')
})
.catch((err) => {console.log(error)
})

//start server
const PORT = process.env.PORT || 3000;
_app.listen(PORT, ()=> {
    console.log(`Node API is running on port ${PORT}`)
})

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));