import { ClientSession, Types } from "mongoose";
import { Design, DesignInterface, LeanDesignDoc, PopulatedLeanAbTestDoc, PopulatedLeanProjectDoc, PopulatedProject, PopulatedProjectStripped, Project } from "../mongoose/schemas";
import { DesignToSave, IncomingDesign } from "../routes/abtests/_index";
import AWS from 'aws-sdk'
import { PutObjectRequest } from "aws-sdk/clients/s3";
import fs from 'fs';
import to from "await-to-js";

// files can be empty and empty array, or array of files
// uploads image to aws bucket "abtestsapp", returns designs properly formatted
export function handleDesignUpload(designs: string[], files: Express.Multer.File[]): Promise<DesignToSave[]> {
    return new Promise<DesignToSave[]>(async (resolve, reject) => {
        
        let properDesigns: DesignToSave[] = [];

        for (let design of designs) {
            const incomingDesign: IncomingDesign = JSON.parse(design);
            let designToSave: DesignToSave = incomingDesign;

            
            // upload images to s3 bucket
            // here the fieldname was set on frontend as the design name, see createAbTestSelectors.ts
            if (files.length > 0) {
                const fileToUpload = files.find(file => file.fieldname === incomingDesign.name);
                if (fileToUpload) {
                    const [e1, imageUrl] = await to(uploadImage(fileToUpload.filename, fileToUpload.path));
                    if (e1) {
                        reject(e1)
                    } else if (imageUrl) {
                        designToSave.imageUrl = imageUrl;
                        logAction(`uploaded aws image: ${imageUrl}`);
                    }
                }
            }    
            properDesigns.push(designToSave);
        }

        if (properDesigns.length === 0) {
            reject('empty designs')
        } else {
            resolve(properDesigns);
        }
    });
}

export function uploadImage(filename: string, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });
        const params: PutObjectRequest = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: filename,
            Body: fs.readFileSync(path)
        }

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err.message);
            } else {
                console.log(data.Location);
                resolve(data.Location);
            }
        });
    });
}


export function deleteImage(imageUrl: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        let urlParts = imageUrl.split('/');
        let objectKey = urlParts[urlParts.length - 1];
        if (objectKey.includes("%20")) {
            objectKey = objectKey.replace(/%20/g, ' ');
        }
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        });
        const params: PutObjectRequest = {
            Bucket: process.env.AWS_BUCKET_NAME as string,
            Key: objectKey
        }
        s3.deleteObject(params, (err) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(true);
            }
        });
    });
}

export function logAction(msg: string) {
    const log  = console.log;
    const date = new Date().toLocaleString();
    log("\n\n-----------------Action-----------------");
    log(msg);
    log(`---${date}---\n\n`);
}