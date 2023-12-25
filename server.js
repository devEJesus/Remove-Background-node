const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000; // You can choose any available port
const { exec, execSync } = require('child_process');
const fs = require('fs');
const mime = require('mime-types');
const { v4: uuidv4 } = require('uuid');

const upload_path = './public/images/upload';
const download_path = './public/images/download';
const storage = multer.diskStorage({
    destination: upload_path,
    filename: function (req, file, callback) {
        const fileExt = path.extname(file.originalname);
        const mimeType = mime.lookup(fileExt) || 'application/octet-stream';

        // Set the content type to the determined MIME type
        file.mimetype = mimeType;

        // Generate the filename
        const filename = `file_${generateUniqueIdentifier()}` + fileExt;

        callback(null, filename);
    }
});


function generateUniqueIdentifier() {
    return uuidv4();
}

function deleteFile(filePath = '') {
    try {
        fs.unlinkSync(filePath);
        console.log('File deleted successfully');
    } catch (err) {
        console.error('Error deleting file:', err);
    }
}

// Initialize multer with the storage engine
const upload = multer({ storage: storage });


app.post('/api/data', upload.single('file'), (req, res) => {

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Log the details of the uploaded file
    console.log('File uploaded:', req.file);

    //Image path when uploaded
    const init_path = `./${req.file.path}`;
    // Image path after handled
    const final_path = `${download_path}/${req.file.filename}`;

    // Replace 'your-command-here' with the actual command you want to execute
    const commandToExecute = `rembg i ${init_path} ${final_path}`;

    const result = execSync(commandToExecute, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing the command: ${error.message}`);
            return;
        }

        // Standard output (stdout) of the command
        console.log(`Command output: ${stdout}`);

        // Standard error (stderr) of the command (if any)
        console.error(`Command errors: ${stderr}`);
    });

    // Read the image file as binary data
    const imageBuffer = fs.readFileSync(final_path);

    // Set the content type to indicate that you are sending an image
    res.setHeader('Content-Type', 'image/png');

    deleteFile(init_path);
    deleteFile(final_path);
    // Send the binary data as the response
    res.send(imageBuffer);

    
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
