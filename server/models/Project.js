const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  technologies: [String],
  liveDemo: String,
  github: String,
  featured: Boolean
});

module.exports = mongoose.model('Project', ProjectSchema);
