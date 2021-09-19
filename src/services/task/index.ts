import { MySqlDB as db } from '../../db';
import {
  ITaskObject,
  ITaskGetObject,
  ITaskOptionObject,
} from '../../interfaces';

export async function find({
  sortBy,
  sortByOrder = 'ASC',
  statusFilterBy,
  page = 0,
}: ITaskGetObject): Promise<any> {
  const defaultPageSize = 10;
  const findObjectWhere: ITaskOptionObject = {
    limit: defaultPageSize,
    offset: defaultPageSize * page,
  };
  if (statusFilterBy && statusFilterBy !== 'All') {
    findObjectWhere.where = {
      status: statusFilterBy,
    };
  }
  if (sortBy) {
    findObjectWhere.order = [[sortBy, sortByOrder]];
  }
  return db.Task.scope('withHash').findAll(findObjectWhere);
}

export async function create(params: ITaskObject): Promise<any> {
  if (await db.Task.findOne({ where: { name: params.name } })) {
    throw 'Task "' + params.name + '" is already taken';
  }

  params.status = 'TODO';
  await db.Task.create(params);
  return {
    message: 'Task was added succefully',
  };
}

export async function update(params: ITaskObject): Promise<any> {
  const task = await db.Task.findOne({ where: { id: params.id } });
  if (!task) {
    throw 'Task "' + params.name + '" not created';
  }

  if (['DONE', 'FAILED'].includes(task.status)) {
    throw 'Task "' + params.name + '" is closed';
  }

  await db.Task.update({ status: params.status }, { where: { id: params.id } });
  return {
    message: 'Task was updated successfully',
  };
}
