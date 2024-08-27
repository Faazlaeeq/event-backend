
const express = require('express')
  , http = require('http');


const app = express();
const server = http.createServer(app)
const logger = require('morgan');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
var multer = require('multer')
var cors = require('cors')
require('dotenv').config();


var path = require('path')
const PORT = process.env.PORT || 3000
app.set('port', PORT);
app.use(bodyParser.json())


const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};


app.use(cors(corsOptions));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

//Middleware...
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))


const event = require('./routes/eventRoutes')

app.use('/api/event', event)





const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: 'public',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now()
      + path.extname(file.originalname))
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|pdf|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new Error('Please upload a Image'))
    }
    cb(undefined, true)
  }
})

app.post('/file/upload', imageUpload.single('image'), function (req, res) {


  const file = req.file

  if (file) {

    const response = {
      status: "OK",
      result: {
        success: true,
        message: "File uploaded successfully.",
        imageURL: "http://ec2-54-161-229-80.compute-1.amazonaws.com:3000/" + file.filename // Assuming `file.filename` is the name of the uploaded file.
      },
    };

    return res.status(201).json(response);

  }


})

app.get("/", (req, res) => res.send("Express on Vercel"));






//Catch 404 Error and forward then to error handler..
app.use((req, res, next) => {

  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Error handler function...
app.use((err, req, res, next) => {

  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;

  //Respond to client..
  res.status(status).json({

    success: false,
    message: err


  });

  console.error(err);

}
);

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

//Start the sever..
// const port = app.get('post') || 3000;
// app.listen(port,() => console.log('Server is listening on port' + port));

server.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});