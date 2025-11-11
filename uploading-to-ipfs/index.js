const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

async function uploadToPinata() {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const pinataApiKey = process.env.PINATA_API_Key;
    const pinataSecretApiKey = process.env.PINATA_API_Secret;

    // Create a readable stream from your JSON file
    const readableStreamForFile = fs.createReadStream('./metadata.json');

    let data = new FormData();
    data.append('file', readableStreamForFile);

    try {
        const response = await axios.post(url, data, {
            maxBodyLength: 'Infinity', // This is needed to prevent axios from throwning error with large files
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey,
            },
        });

        console.log('File uploaded successfully!');
        console.log('IPFS Hash (CID):', response.data.IpfsHash);
        // Access your file at: https://gateway.pinata.cloud/ipfs/YOUR_CID
        console.log(`View at: https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

uploadToPinata();
