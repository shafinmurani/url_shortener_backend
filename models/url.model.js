import mongoose from "mongoose";
const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: [true, "Please provide a url to shorten"] },
    shortUrl: { type: String, required: true, unique: true },
    dateCreated: { type: Date, default: Date.now }
});
const Url = mongoose.model('Url', urlSchema);
export default Url;