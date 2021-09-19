import express from 'express';
import cors from 'cors';
import { urlencoded, json } from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import 'dotenv/config';
import { ErrorHandler } from './helper';
import { userRouter } from './controllers';
import { UserService } from './services';

const app = express();

app.use(helmet());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());
app.use(cookieParser());

// routes
app.use('/users', userRouter);

app.use(ErrorHandler);

app.use('/tasks', UserService.authorization);

const port =
  process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
