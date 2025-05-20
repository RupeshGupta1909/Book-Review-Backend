class BookPresenter {
  static present(book) {
    if (!book) return null;
    
    const doc = book._doc || book;
    return {
      id: doc._id,
      title: doc.title,
      author: doc.author,
      description: doc.description || '',
      isbn: doc.isbn,
      publishedYear: doc.publishedYear,
      averageRating: doc.averageRating || 0,
      totalReviews: doc.totalReviews || 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  static presentMany(books) {
    return Array.isArray(books) 
      ? books.map(book => this.present(book))
      : [];
  }
}

module.exports = BookPresenter; 