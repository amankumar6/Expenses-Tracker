const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');

// Initialize Azure Storage client
let blobServiceClient;
let containerClient;
const containerName = 'transaction-receipts';

// Initialize container
async function initializeContainer() {
    try {
        if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
            throw new Error('Azure Storage connection string is not configured');
        }

        blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
        containerClient = blobServiceClient.getContainerClient(containerName);

        // Create container if it doesn't exist
        console.log('Initializing Azure Storage container...');
        await containerClient.createIfNotExists({
            access: 'blob'
        });
        console.log('Azure Storage container initialized successfully');
    } catch (error) {
        console.error('Error initializing Azure Storage:', error);
        throw error;
    }
}

// Upload file to Azure Storage
async function uploadReceipt(file) {
    try {
        if (!containerClient) {
            await initializeContainer();
        }

        if (!file || !file.buffer) {
            throw new Error('Invalid file data');
        }

        // Generate unique name for the blob
        const blobName = `${uuidv4()}-${file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload file
        console.log('Uploading receipt to Azure Storage...');
        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype }
        });
        console.log('Receipt uploaded successfully');

        return blockBlobClient.url;
    } catch (error) {
        console.error('Error uploading receipt:', error);
        throw new Error(`Failed to upload receipt: ${error.message}`);
    }
}

// Delete receipt from Azure Storage
async function deleteReceipt(receiptUrl) {
    try {
        if (!containerClient) {
            await initializeContainer();
        }

        if (!receiptUrl) return;
        
        // Extract blob name from URL
        const blobName = receiptUrl.split('/').pop();
        if (!blobName) {
            console.warn('Invalid receipt URL format');
            return;
        }

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        
        console.log('Deleting receipt from Azure Storage...');
        await blockBlobClient.deleteIfExists();
        console.log('Receipt deleted successfully');
    } catch (error) {
        console.error('Error deleting receipt:', error);
        throw new Error(`Failed to delete receipt: ${error.message}`);
    }
}

module.exports = {
    initializeContainer,
    uploadReceipt,
    deleteReceipt
};
