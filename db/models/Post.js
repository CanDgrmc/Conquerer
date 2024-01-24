const Post = (sequelize, DataTypes) => {
  const post = sequelize.define('Post', {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
      autoIncrement: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  }, {
    paranoid: true
  });

post.associate = function(models) {
  post.hasMany(models.Comment, {
    foreignKey: 'postId',
    as: 'comments',
    onDelete: 'CASCADE',
  });

  post.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'author',
    onDelete: 'CASCADE',
  })

  post.belongsTo(models.Category, {
    foreignKey: 'categoryId',
    as: 'category',
    onDelete: 'CASCADE',
  })
};

return post;
}



module.exports = Post