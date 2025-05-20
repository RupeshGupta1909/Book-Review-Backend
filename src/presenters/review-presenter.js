class ReviewPresenter {
  static present(review) {
    if (!review) return null;
    
    const doc = review._doc || review;
    return {
      id: doc._id,
      rating: doc.rating,
      comment: doc.comment || '',
      book: doc.book,
      user: doc.user,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  static presentMany(reviews) {
    return Array.isArray(reviews) 
      ? reviews.map(review => this.present(review))
      : [];
  }
}

module.exports = ReviewPresenter; 