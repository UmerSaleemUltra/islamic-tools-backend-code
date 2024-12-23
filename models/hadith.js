import mongoose from 'mongoose';

const hadithSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  hadithNumber: { type: String, required: true },
  englishNarrator: { type: String, required: true },
  hadithEnglish: { type: String, required: true },
  hadithUrdu: { type: String, required: true },
  urduNarrator: { type: String, required: true },
  hadithArabic: { type: String, required: true },
  headingArabic: { type: String, default: '' },
  headingUrdu: { type: String, default: '' },
  headingEnglish: { type: String, default: '' },
  chapterId: { type: String, required: true },
  bookSlug: { type: String, required: true },
  volume: { type: String, required: true },
  status: { type: String, required: true },
});

const Hadith = mongoose.model('Hadith', hadithSchema);

export default Hadith;
