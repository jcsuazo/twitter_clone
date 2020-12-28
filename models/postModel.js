import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    pinned: Boolean,
    linkes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

const Post = mongoose.model('Post', postSchema);

export default Post;
