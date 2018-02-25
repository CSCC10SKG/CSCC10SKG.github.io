var api = (function(){
    "user strict";

    var module = {};
    
    var loggedin = JSON.parse(localStorage.getItem("loggedin"));
    if (loggedin == null) {
        loggedin = false;
        localStorage.setItem("loggedin", JSON.stringify(loggedin));
    }
    
    var items = JSON.parse(localStorage.getItem("items"));
    if (items == null) {
        items = {};
        localStorage.setItem("items", JSON.stringify(items));
    }
    
    var currentUser = localStorage.getItem("currentUser");
    if (currentUser == null) {
        currentUser = "";
        localStorage.setItem("currentUser", currentUser);
    }
    
    module.isLoggedIn = function() {
        return loggedin;
    }

    module.login = function(username, password){
        if (username in items) {
            if (items[username].password === password) {
                this.loggedin = true;
                this.currentUser = username;
                localStorage.setItem("currentUser", this.currentUser);
                localStorage.setItem("loggedin", JSON.stringify(this.loggedin));
                return items[username];
            }
        }
        return {};
    }
    
    module.logout = function() {
        this.loggedin = false;
        this.currentUser = "";
        localStorage.setItem("loggedin", JSON.stringify(this.loggedin));
        localStorage.setItem("currentUser", this.currentUser);
        localStorage.setItem("items", JSON.stringify(items));
        return this.loggedin;
    }
    
    module.register = function(username, password) {
        this.loggedin = true;
        items[username] = {password: password};
        this.currentUser = username;
        localStorage.setItem("loggedin", JSON.stringify(this.loggedin));
        localStorage.setItem("items", JSON.stringify(items));
        localStorage.setItem("currentUser", this.currentUser);
        return {password: password};
    }
    
    module.updateProfile = function(oldusername, username, password, fullname, pic) {
        delete items[oldusername];
        items[username] = {password:password, fullname:fullname, pic:pic};
        localStorage.setItem("items", JSON.stringify(items));
        return items[username];
    }
    
    module.getUserName = function() {
        return currentUser;
    }
    
    module.getUserInfo = function(user) {
        return items[user];
    }

    return module;
})();