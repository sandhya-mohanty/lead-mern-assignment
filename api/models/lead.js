
const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  date: Date,
  leadId: Number,
  objectId: Number,
  type: String, 
  company: String,
  name: String,
  postcode: String,
  status: String, 
  broker: String,
  subscription: String, 
  activityDate: Date
});

module.exports = mongoose.model('Lead', LeadSchema);
