const User = (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
      autoIncrement: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
  });

  user.associate = function(models) {
    user.hasMany(models.Post, {
      foreignKey: 'userId',
      as: 'posts',
      onDelete: 'CASCADE',
    });
  
  };


  return user;
}

module.exports = User;