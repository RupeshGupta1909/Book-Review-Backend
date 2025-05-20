class UserPresenter {
  static present(user) {
    if (!user) return null;
    
    const doc = user._doc || user;
    return {
      id: doc._id,
      username: doc.username,
      email: doc.email,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  static presentMany(users) {
    return Array.isArray(users) 
      ? users.map(user => this.present(user))
      : [];
  }

  static presentWithToken(user, token) {
    if (!user) return null;
    
    return {
      ...this.present(user),
      token
    };
  }
}

module.exports = UserPresenter; 