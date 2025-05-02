
const express = require('express');
const lead = require('../models/lead');
const router = express.Router();

// GET Leads with filters, search & pagination
router.get('/', async (req, res) => {
  const {
    search,
    postcode,
    status,
    type,
    broker,
    subscription,
    from,
    until,
    page = 1,
    limit = 10
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { leadId: parseInt(search) || 0 },
      { objectId: parseInt(search) || 0 },
      { name: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } }
    ];
  }

  if (postcode) query.postcode = postcode;
  if (status) query.status = status;
  if (type) query.type = type;
  if (broker) query.broker = broker;
  if (subscription) query.subscription = subscription;

  if (from && until) {
    query.date = {
      $gte: new Date(from),
      $lte: new Date(until)
    };
  }

  try {
    const leads = await lead.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const count = await lead.countDocuments(query);
    res.json({ leads, totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST route to insert new lead
router.post('/', async (req, res) => {
  try {
    const newLead = new lead(req.body); // Create new lead from the request body
    const savedLead = await newLead.save(); // Save lead to database
    res.status(201).json(savedLead); // Return the saved lead in response
  } catch (err) {
    res.status(400).json({ error: err.message }); // Handle validation or other errors
  }
});

module.exports = router;
