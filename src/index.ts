import express from 'express';
import cors from 'cors';
import { urlencoded, json } from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import https from 'https';
import fs from 'fs';
import 'dotenv/config';
import { ErrorHandler } from './helper';
import { userRouter, taskRouter } from './controllers';
import { UserService } from './services';

const app = express();

app.use(helmet());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());
app.use(cookieParser());

// routes
app.use('/api/users', userRouter);

app.use(ErrorHandler);

app.use('/api/tasks', UserService.authorization, taskRouter);

const port =
  process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 4000;
https
  .createServer(
    {
      key: fs.readFileSync('./certs/server.key'),
      cert: fs.readFileSync('./certs/server.cert'),
    },
    app
  )
  .listen(port, () => console.log('Server listening on port ' + port));
