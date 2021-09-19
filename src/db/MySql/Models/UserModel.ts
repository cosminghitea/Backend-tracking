import {
  DataTypes,
  Sequelize,
  ModelOptions,
  ModelCtor,
  Model,
} from 'sequelize';

function model(sequelize: Sequelize): ModelCtor<Model<unknown, unknown>> {
  const attributes = {
    username: { type: DataTypes.STRING, allowNull: false },
    hash: { type: DataTypes.STRING, allowNull: false },
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

  return sequelize.define('User', attributes, options);
}

export default model;
