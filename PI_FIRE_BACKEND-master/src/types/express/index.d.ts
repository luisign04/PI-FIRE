import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;  // ← Aqui adiciona o req.user
      file?: Multer.File;
      files?: Multer.File[];
    }
  }

  namespace Multer {
    interface File {
      filename: string;
      path: string;
      mimetype: string;
      size: number;
    }
  }
}

export {};
