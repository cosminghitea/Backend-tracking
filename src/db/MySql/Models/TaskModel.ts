import {
  DataTypes,
  Sequelize,
  ModelOptions,
  ModelCtor,
  Model,
} from 'sequelize';

const statusEnum = ['TODO', 'IN_PROGRESS', 'DONE', 'FAILED'];

function model(sequelize: Sequelize): ModelCtor<Model<unknown, unknown>> {
  const attributes = {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    dueDate: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM(...statusEnum),
      allowNull: false,
      default: statusEnum[0],
    },
    tags: { type: DataTypes.JSON, allowNull: true },
  };

  const options: ModelOptions = {
    defaultScope: {
      attributes: { exclude: ['hash'] },
    },
    scopes: {
      withHash: {
        attributes: {
          exclude: [],
        },
      },
    },
  };

  return sequelize.define('Task', attributes, options);
}

export default model;
