const mongoose = requere("mongoose");

const bookShema = mongoose.Shema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: {
    type: [
      {
        userId: { type: String, required: true },
        grade: { type: Number, required: true },
      },
    ],
    default: [],
    required: true,
    index: {
      unique: true,
      sparse: true,
      partialFilterExpression: { "ratings.userId": { $exists: true } },
    },
  },
  averageRating: { type: Number, default: 0, required: true },
});

module.exports = mongoose.model("Book", bookShema);
