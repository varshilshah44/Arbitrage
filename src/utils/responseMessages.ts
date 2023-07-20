const messages = {
  success: {
    createMessage: (name: string) => `Success! The ${name} has been created.`,
    updateMessage: (name: string) => `Success! ${name} has been updated.`,
    deleteMessage: (name: string) => `Success! ${name} has been deleted.`,
    listMessage: (name: string) => `List of ${name} retrieved successfully.`,
    retrievedMessage: (name: string) =>
      `Success! The ${name} has been retrieved successfully.`,
    signUpMessage: "Success! Signup completed successfully.",
    sasToken: "Success! SAS token sent successfully.",
    NotRunning: (name: string) => `No ${name} are currently running.`,
  },
  error: {
    invalidToken: "Invalid token. Please log in again to continue.",
    expiredToken: "Your token has expired. Please log in again to continue.",
    validEmailPassword:
      "Invalid credentials. Please check your email and password and try again.",
    userNotFound: "Error! The user with the given credentials does not exist.",
    createFaildMessage: (name: string) =>
      `Oops! The ${name} could not be created due to an unexpected error. Please try again later.`,
    deleteFaildMessage: (name: string) =>
      `Oops! The ${name} could not be deleted due to an unexpected error. Please try again later.`,
    updateFaildMessage: (name: string) =>
      `Oops! The ${name} could not be updated due to an unexpected error. Please try again later.`,
    retrievedFailed: (name: string) =>
      `Oops! Failed to retrieve ${name} due to an unexpected error. Please try again later.`,
    signUpFailed:
      "Oops! Signup failed. Please check your information and try again.",
    invalidParameters:
      "Oops! The provided parameters are invalid. Please check your input and try again.",
    alreadyExist: (name: string) =>
      `Sorry, the ${name} provided is already registered. Please use a different ${name}.`,
    notFound: (name: string) =>
      `Oops! The ${name} you're looking for could not be found. Please check the details and try again.`,
    notAvailable: (name: string) =>
      `Sorry, ${name} is currently unavailable for this post.`,
    isDeleted: (name: string) => `${name} deleted; posting not available.`,
    notStarted: (name: string) =>
      `${name} has not yet started; posting is currently unavailable.`,
    ended: (name: string) =>
      `${name} has ended; posting is no longer available.`,
    invalidRegitrationId:
      "Invalid registration ID. Please provide a valid registration ID.",
    notSupportedUploadType: (name: string) =>
      `${name} file uploads are not supported. Please choose a different file.`,
  },
};

export default messages;
