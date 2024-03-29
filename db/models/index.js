const fs = require('fs');
const path = require('path');
const {Sequelize} = require('sequelize');

const basename = path.basename(__filename);



module.exports = (config) => {
  const db = {};

  let sequelize;
  if (config.DATABASE_URL) {
    sequelize = new Sequelize(config.DATABASE_URL, {
      dialect: 'postgres'
    });
  } else if(config.dbConfig.database && config.dbConfig.username && config.dbConfig.password) {
    sequelize = new Sequelize(config.dbConfig.database, config.dbConfig.username, config.dbConfig.password, {
      dialect: config.dbConfig.dialect,
      host: config.dbConfig.host
    });
  }
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize,Sequelize);
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return db;
};