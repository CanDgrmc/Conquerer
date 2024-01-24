const Comment = (sequelize, DataTypes) => {
  const comment = sequelize.define('Comment', {
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
    postId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    commentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    
  });

comment.associate = function(models) {

  comment.belongsTo(models.Post, {
    foreignKey: 'postId',
    as: 'post',
    onDelete: 'CASCADE',
  })

  comment.hasMany(comment, {
    foreignKey: 'commentId',
    as: 'comments',
    onDelete: 'CASCADE',
  });
  comment.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'author',
    onDelete: 'CASCADE',
  })
};

return comment;
}



module.exports = Comment