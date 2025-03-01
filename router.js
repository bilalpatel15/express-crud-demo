const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize AWS SDK
AWS.config.update({
  accessKeyId: 'AKIAVHQ5EPMALZ74Q4JG',
  secretAccessKey: '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',
});

const s3 = new AWS.S3();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("./controllers/Todo");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Let's build a CRUD API!");
});

router.get("/todos", getTodos);
router.post("/todos", createTodo);
router.put("/todos/:todoID", updateTodo);
router.delete("/todos/:todoID", deleteTodo);
router.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;

  // Set up the S3 upload parameters
  const params = {
    Bucket: 'bilal-s3bucket-test',
    Key: `${uuidv4()}-${file.originalname}`,
    Body: file.buffer,
  };

  // Upload the file to the S3 bucket
  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file:', err);
      res.status(500).send('Error uploading file');
    } else {
      console.log('File uploaded successfully:', data.Location);
      res.send('File uploaded successfully');
    }
  });
});

module.exports = router;
