

var SecurityLib = function () {

  if (SecurityLib.caller != SecurityLib.getInstance) {
    throw new Error("This object cannot be instanciated");
  }

  this.authToken = null;
}

//create a singleton pattern to make sure it's a unique instance
SecurityLib.instance = null;
SecurityLib.getInstance = function () {
  if (this.instance === null) {
    this.instance = new SecurityLib();
  }
  return this.instance;
};


SecurityLib.prototype = {

  /**
   * This function is calling for the components code to make sure, the developer have setted the token
   * 
   * @param {*} next 
   */
  isAuth: function (next) {
    if (this.authToken && this.authToken.lenght > 0) {
      next(null, true);
    } else {
      next(null, false);
    }
  },
  /**
   * This function should be calling at the begining of the SDK, this will store token that will be used in every call
   * 
   * @param {*} authToken 
   * @param {*} next 
   */
  setToken: function (authToken, next) {
    if (authToken && authToken.lenght > 0) {
      this.authToken = authToken;
      next(null, authToken);
    } else {
      next('Token supplied its not valitd', null);
    }
  },
  /**
   * 
   * @param {*} authToken 
   * @param {*} next 
   */
  logout: function (authToken, next) {
    if (this.authToken == authToken) {
      this.authToken = null;
      next();
    } else {
      next('The token you try to expire does not the same you\' login', null);
    }
  },
  /**
   * Expire the token
   * 
   * @param {*} authToken 
   * @param {*} next 
   */
  expireToken: function (authToken, next) {
    this.logout(authToken, next);
  }

}


exports = module.exports = SecurityLib.getInstance();