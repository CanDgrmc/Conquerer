const Category = (sequelize, DataTypes) => {
  const category = sequelize.define('Category', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
      autoIncrement: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    
  });

category.associate = function(models) {

  category.hasMany(models.Post, {
    foreignKey: 'categoryId',
    as: 'posts',
    onDelete: 'CASCADE',
  })
};

return category;
}



module.exports = Category