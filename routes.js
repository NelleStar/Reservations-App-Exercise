// require express, the customer and reservation models and router
const express = require("express");
const Customer = require("./models/customer");
const Reservation = require("./models/reservation");
const router = new express.Router();

/** Homepage: show list of customers. */
// try catch block used for an async function - we are first trying to create a variable called customers which is awaiting a promise from the Customer class which is calling a static method on the class and not instance. If successful we return the response and render the customer_list template filled with the array of customer objects - if it fails then it goes to catch and returns an error
router.get("/", async function(req, res, next) {
  try {
    const customers = await Customer.all();
    return res.render("customer_list.html", { customers });
  } catch (err) {
    return next(err);
  }
});

/** Form to add a new customer. */
// try and catch block used for async function to show form to add new customer - we want to render the customer_new_form template - and throw an error if unsuccessful in our GET request
router.get("/add/", async function(req, res, next) {
  try {
    return res.render("customer_new_form.html");
  } catch (err) {
    return next(err);
  }
});

/** Handle adding a new customer. */
// try and catch block used for async function to POST the new customer information - first we try to extract the user information provided in above form and make a new variable aka a new instance of the Customer class and we then await the save() method which is on the instance and not class. if successful we want to return the response and redirect us to the customer id url - else we throw an error
router.post("/add/", async function(req, res, next) {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const notes = req.body.notes;

    const customer = new Customer({ firstName, lastName, phone, notes });
    await customer.save();

    return res.redirect(`/${customer.id}/`);
  } catch (err) {
    return next(err);
  }
});

/** Show a customer, given their ID. */
// GET request to /customers/id as an async function with a try and catch block for error handling - we first create an instance of customer based on an await static method .get() called on the Customer class using the params from the request. If/when we get a positive response we then call a non-static method on the instance of customer and .getReservations() --- Once we receive the promise back from both we return a response and rended the customer_details template using the customer and reservations we received back --- else we throw an error
router.get("/:id/", async function(req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);
    const reservations = await customer.getReservations();
    const customerFullName = await customer.fullName();

    return res.render("customer_detail.html", { customer, reservations, customerFullName });
  } catch (err) {
    return next(err);
  }
});

/** Show form to edit a customer. */
// first step of editing a customer - async function using a try and catch block we first take the user to /id/edit as a get request using the customer variable which is using a static method .get() to retrieve the user information based on the request params id its associated with. Once we receive a positive response we render the customer_edit_form using the customer instance. If the promise fails we return a middleware error
router.get("/:id/edit/", async function(req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);
    const customerFullName = await customer.fullName();

    res.render("customer_edit_form.html", { customer, customerFullName });
  } catch (err) {
    return next(err);
  }
});

/** Handle editing a customer. */
// second step to editing a user is the post request where we are at the same url using another async function. In the try block we are setting the customer variable to an instance of Customer based on the id given in the params using the static .get() method and setting all of the user information that was given to the appropraite columns. We then use the .save() method on the customer instance and return to redirect the user back to their /id url aka their customer page. Should this fail we throw an error
router.post("/:id/edit/", async function(req, res, next) {
  try {
    const customer = await Customer.get(req.params.id);
    customer.firstName = req.body.firstName;
    customer.lastName = req.body.lastName;
    customer.phone = req.body.phone;
    customer.notes = req.body.notes;
    await customer.save();

    return res.redirect(`/${customer.id}/`);
  } catch (err) {
    return next(err);
  }
});

/** Handle adding a new reservation. */
// POST request on the /userid/add-reservation route - async function using a try and catch block to ensure error handling - we first try to take the needed information given from user and create a new instance of a reservation using the Reservation class (constructor) and then we await the promise from reservation.save() method. successful save will return and redirect us back to the /id page for the customer and a failure will result in an error
router.post("/:id/add-reservation/", async function(req, res, next) {
  try {
    const customerId = req.params.id;
    const startAt = new Date(req.body.startAt);
    const numGuests = req.body.numGuests;
    const notes = req.body.notes;

    const reservation = new Reservation({
      customerId,
      startAt,
      numGuests,
      notes
    });
    await reservation.save();

    return res.redirect(`/${customerId}/`);
  } catch (err) {
    return next(err);
  }
});

// export the router to be used in other files
module.exports = router;
