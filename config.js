const dataBaseUrl = 'mongodb://127.0.0.1:27017/mestodb';

const { PORT = 3000 } = process.env;

const urlRegexPattern = /^(http(s):\/\/)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

module.exports = {
  dataBaseUrl,
  PORT,
  urlRegexPattern,
};
