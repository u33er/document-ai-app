import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
//import multer from 'multer';

//const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // upload.array('files')(req, res, async (err) => {
    //   if (err) {
    //     return res.status(500).json({ error: err.message });
    //   }

      const acceptedFiles = req.body.files;
      console.log(acceptedFiles);

      const client = new DocumentProcessorServiceClient({
        keyFilename: './sound-psyche-394611-54f13d507200.json',
      });

      const uploadFiles = async () => {
        if (acceptedFiles && acceptedFiles.length > 0) {
      
           try { 
            const request = {
              name: `projects/410375542841/locations/us/processors/490e1cedd7b0a917`,
              rawDocument: {
                content: acceptedFiles,
                mimeType: 'application/pdf',
              },
            };

            const [response] = await client.processDocument(request);
            const { document } = response;

            console.log(document);
    
            return document;
          } catch (error: any) {
          console.log(error?.metadata?.internalRepr);
          throw error;
          }
      
        } else {
          console.log('No files to upload');
        }
      };
      
      const _res = await uploadFiles();
      res.status(200).json({data: _res, message: 'Files uploaded successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
