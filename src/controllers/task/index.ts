import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { RequestValidator } from '../../helper';
import { TaskService } from '../../services';

const router = Router();

router.post('*', createTaskSchema, createTask);
router.get('*', geTasksSchema, getTasks);
router.put('*', updateTaskSchema, updateTask);

function createTaskSchema(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    name: Joi.string().required().min(1),
    description: Joi.string().required().min(1),
    dueDate: Joi.date(),
    tags: Joi.array(),
  });
  RequestValidator(req, next, schema);
}

function createTask(req: Request, res: Response, next: NextFunction) {
  TaskService.create(req.body)
    .then((result) => res.status(200).json(result))
    .catch(next);
}

function updateTaskSchema(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    name: Joi.string().required().min(1),
    status: Joi.string().required().min(1),
    id: Joi.number().required(),
  });
  RequestValidator(req, next, schema);
}

function updateTask(req: Request, res: Response, next: NextFunction) {
  TaskService.update(req.body)
    .then((result) => res.status(200).json(result))
    .catch(next);
}

function geTasksSchema(req: Request, res: Response, next: NextFunction) {
  const schema = Joi.object({
    sortBy: Joi.string(),
    sortByOrder: Joi.string(),
    statusFilterBy: Joi.string(),
    page: Joi.number().required(),
  });
  RequestValidator(req, next, schema);
}

function getTasks(req: Request, res: Response, next: NextFunction) {
  TaskService.find(req.body)
    .then((result) => res.status(200).json(result))
    .catch(next);
}

export default router;
