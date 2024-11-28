import mongoose from "mongoose";

const socialProfileSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
});

const SocialProfile = mongoose.models.SocialProfile || mongoose.model("SocialProfile", socialProfileSchema);

export default SocialProfile;