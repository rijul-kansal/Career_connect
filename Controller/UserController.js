const UserModel = require('./../Model/UserModel');
const ErrorClass = require('./../Utils/ErrorClass');
const FormDataS3 = require('./FormDataS3')
const compress= require('compress-pdf')
// update user info
const updateMe = async (req, res, next) => {
  try {
    req.user.name = req.body.name || req.user.name;
    req.user.image = req.body.image || req.user.image;
    req.user.currentLocation =
      req.body.currentLocation || req.user.currentLocation;
    req.user.gender = req.body.gender || req.user.gender;
    req.user.dateOfBirth = req.body.dateOfBirth || req.user.dateOfBirth;
    req.user.mobileNumber = req.body.mobileNumber || req.user.mobileNumber;
    req.user.careerPreference =
      req.body.careerPreference || req.user.careerPreference;
    req.user.education = req.body.education || req.user.education;
    req.user.skills = req.body.skills || req.user.skills;
    req.user.language = req.body.language || req.user.language;
    req.user.experience = req.body.experience || req.user.experience;
    req.user.project = req.body.project || req.user.project;
    req.user.summary = req.body.summary || req.user.summary;
    req.user.achievements = req.body.achievements || req.user.achievements;
    req.user.resumeLink = req.body.resumeLink || req.user.resumeLink;
    req.user.githubLink = req.body.githubLink || req.user.githubLink;
    req.user.portfolioLink = req.body.portfolioLink || req.user.portfolioLink;
    req.user.codingProfileLink =
      req.body.codingProfileLink || req.user.codingProfileLink;
    req.user.preferredJob = req.body.preferredJob || req.user.preferredJob;
    req.user.typeOfUser = req.body.typeOfUser || req.user.typeOfUser;
    req.user.fcmToken = req.body.fcmToken || req.user.fcmToken;
    req.user.certificateEarned =
      req.body.certificateEarned || req.user.certificateEarned;
    const user = req.user;
    // saving in DB
    await user.save();
    // comment some extra info
    user.password = undefined;
    user.OTPValidTill = undefined;
    user.OTPVerification = undefined;
    user.ChangePassword = undefined;
    user.VerifiedUser = undefined;
    user.lastUpdated = undefined;
    const resp = {
      status: 'success',
      data: {
        data: user,
      },
    };

    res.status(201).json(resp);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};
// get my information
const getMe = async (req, res, next) => {
  try {
    // getting my info
    const user = req.user;

    // commenting some extra info
    user.password = undefined;
    user.OTPValidTill = undefined;
    user.OTPVerification = undefined;
    user.ChangePassword = undefined;
    user.VerifiedUser = undefined;
    const response = {
      status: 'success',
      timeLeft: req.timeLeft,
      timeLeftInMilliSecond: req.timeLeftInMilliSecond,
      data: {
        data: user,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};

// deleting my account
const deleteMe = async (req, res, next) => {
  try {
    // getting my email
    const email = req.user.email;
    // deleting my account
    await UserModel.deleteOne({ email });

    res.status(204).json({ status: 'success' });
  } catch (err) {
    return next(new ErrorClass(err.message, 400));
  }
};

const updateImageOrResume = async(req,res,next)=>{
  try{
    let file = req.files[0]
    const type = req.body.type
    if(!type || !file)
    {
       return next(new ErrorClass('Please pass file and type',400))
    }
    const fileName = req.user._id+type
    console.log(file)
    file.buffer = await compress.compress(file.buffer)
    const download = await FormDataS3.savingFileToS3(file,fileName)
    console.log(download.download_url)
    if(type === "Resume")
    {
      req.user.resumeLink = download.download_url
    }
    else if(type === 'Image')
    {
      req.user.image=download.download_url
    }
    console.log(req.user)
    await req.user.save()

    const response = {
      status:"success",
      data:req.user
    }
    res.status(200).json(response)
    }catch(error)
    {
     return next(new ErrorClass(error.message,400))
    }
}
module.exports = {
  updateMe,
  getMe,
  deleteMe,
  updateImageOrResume
};



