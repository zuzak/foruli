var mongoose = require('mongoose')

var bookSchema = new mongoose.Schema({
  url: String,              // OpenLibrary URL
  title: String,
  subtitle: String,
  authors: Array,
  identifiers: Array,       // ISBN, LCCN, etc.
  classifications: String,  // DDC, LCC, etc.
  subjects: Array,          // OpenLibrary subjects
  subject_places: Array,    //             places
  subject_people: Array,    //             people
  subject_times: Array,     //             times
  publishers: Array,
  publish_places: Array,
  publish_date: String,
  excerpts: Array,          // extracts from book
  links: Array,
  cover: Array,             // picture of cover
  ebooks: Array,            // link to IA ebooks
  number_of_pages: Number,
  weight: String            // string of weight
})

var book = mongoose.model('Book', bookSchema)

module.exports = book
