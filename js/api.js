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
    
    var evts = JSON.parse(localStorage.getItem("events"));
    if (evts == null) {
        evts = [];
        localStorage.setItem("events", JSON.stringify(evts));
    }
    
    var names = ["Basilia","Mariela","Claudia","America","Roxanne","Melaine","Roxanna","Rashida","Silva","Lavone","Angila","Kum","Marin","Queenie","Wonda","Bradley","Nikole","Amber","Mittie","Berry","Waneta","Janene","Carole","Alonzo","Ashli","Mike","Willodean","Tiara","Domitila","Shameka","Roselle","Geraldo","Bunny","Celsa","Cear","Leonel","Jacinda","Rima","Victoria","Leontine","Elinore","Karyn","Jasper","Marvel","Mariam","Kamala","Vinita","Shaun","Jaime","Rigoberto"];
    
    var msgs = ["The impulse composes the chunky stage.","The excellent middle reports the doubt.","The hope renders the brass.","The common voice maintains the crush.","The common voice maintains the crush.","The common voice maintains the crush.","The government interacts the entertaining print.","The governmentinteracts the entertaining print.","The seat consolidates the produce.","The seat consolidates the produce.","The impulse composes the chunkystage.","The impulse composes the chunky stage.","The year debates the two market.","The business elects the low position.","The reward defers thelevel.","The market submits the fast bread.","The ruthless comparison segments the weather.","The wretched knowledge advises the force.","Thecompetition delegates the well-off color.","The owner engineers the humdrum expansion.","The big breath authorizes the ink.","The minor mindactivates the rain.","The dapper surprise searchs the attic.","The request arranges the cloth.","The system litigates the design.","The space donkeysthe young protest.","The walk discusss the curious silk.","The current acts the connection.","The breezy business examines the destruction.","Theexpansion compares the attack.","The outrageous push standardizes the note.","The abaft guide adjusts the twist.","The rain furnishs thesoggy trouble.","The drink produces the testy road.","The law motivates the workable event.","The wretched knowledge advises the force.","Theompetition delegates the well-off color.","The owner engineers the humdrum expansion."];
    
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
        console.log("logout");
        this.loggedin = false;
        this.currentUser = "";
        localStorage.setItem("loggedin", JSON.stringify(this.loggedin));
        localStorage.setItem("currentUser", this.currentUser);
        localStorage.setItem("items", JSON.stringify(items));
        return this.loggedin;
    }
    
    module.register = function(username, password) {
        this.loggedin = true;
        items[username] = {password: password, fullname:"", pic:"", favs:[], myevents:[]};
        this.currentUser = username;
        localStorage.setItem("loggedin", JSON.stringify(this.loggedin));
        localStorage.setItem("items", JSON.stringify(items));
        localStorage.setItem("currentUser", this.currentUser);
        return {password: password, fullname:"", pic:"", favs:[], myevents:[]};
    }
    
    module.updateProfile = function(oldusername, username, password, fullname, pic) {
        var oldUser = items[oldusername];
        delete items[oldusername];
        if (oldUser)
            items[username] = {password:password, fullname:fullname, pic:pic, favs: oldUser.favs, myevents: oldUser.myevents};
        else
            items[username] = {password:password, fullname:fullname, pic:pic, favs: [], myevents: []};        
        localStorage.setItem("items", JSON.stringify(items));
        return items[username];
    }

    module.addToFavs = function(user, fav) {
        if (items[user].favs.indexOf(fav) < 0)
            items[user].favs.push(fav);
        localStorage.setItem("items", JSON.stringify(items));
    }

    module.addToMyEvents = function(user, evt) {
        if (items[user].evts.indexOf(evt) < 0)
            items[user].myevents.push(evt);
        localStorage.setItem("items", JSON.stringify(items));
    }
    
    module.getUserName = function() {
        return currentUser;
    }
    
    module.getUserInfo = function(user) {
        return items[user];
    }
    
    module.getRandomFeedItem = function() {
        var user = names[Math.floor(Math.random() * names.length)];
        var msg = msgs[Math.floor(Math.random() * msgs.length)];
        
        return [user, msg];
    }
    
    module.getEvents = function() {
        return evts;
    }
    
    module.getEvent = function(id) {
        for (var i = 0; i < evts.length; i++){
            console.log(evts[i].id === id);
            if (evts[i].id === id) return evts[i];
        }
        return {};
    }
    
    module.addEvent = function(id, name, date, desc, fee, isPromo) {
        console.log(typeof(evts));
        evts.push({id: id, name: name, date: date, desc: desc, fee: fee, isPromo: isPromo});
        localStorage.setItem("events", JSON.stringify(evts));
    }

    return module;
})();