import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { v2 as cloudinary } from 'cloudinary';
import { File } from 'formidable';
import dev from '../utils/logs';

interface CustomFile extends File {
  name: string;
  tempFilePath: string;
}

export async function picUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
        error: 'No token provided',
      });
    }

    const { picture } = req.files as { picture?: CustomFile };

    if (!picture) {
      next();
      return;
    }

    const fileName = req.user.toString();
    dev.log('Uploading picture');
    const uploadImage = await cloudinary.uploader.upload(
      picture.tempFilePath,
      {
        folder: 'moniepaddy',
        public_id: `${fileName}`,
        format: 'jpg',
        overwrite: true,
        invalidate: true,
        width: 400,
        height: 400,
        crop: 'limit',
      },
      (err) => {
        if (err) {
          console.error('Problem uploading file');
          console.error(err.message);
          next();
        }
      },
    );
    dev.log('Picture uploaded');
    dev.log(uploadImage.secure_url);
    req.body.picture = uploadImage.secure_url;
    next();
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({
      message: 'upload failed',
      error: err.message,
    });
  }
}
