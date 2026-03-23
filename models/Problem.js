import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  isExample: {
    type: Boolean,
    default: true
  }
}, { _id: true });

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: [String],
  constraints: {
    type: String,
    required: true
  },
  examples: [testCaseSchema],
  hiddenTestCases: [testCaseSchema],
  starterCode: {
    python: { type: String, default: '' },
    cpp: { type: String, default: '' },
    java: { type: String, default: '' }
  },
  functionSignature: {
    cpp: String,
    java: String,
    python: String
  },
  checkerCode: {
    type: String,
    default: null
  },
  useCustomChecker: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Problem', problemSchema);
