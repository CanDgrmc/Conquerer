const UserToken = (sequelize, DataTypes) => {
  const userToken = sequelize.define('UserToken', {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      default: false,
    }
  }, {
    
  });

userToken.associate = function(models) {

  userToken.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'author',
    onDelete: 'CASCADE',
  })
};

return userToken;
}



module.exports = UserToken