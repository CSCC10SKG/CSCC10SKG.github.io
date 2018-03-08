(function(){
    
    window.onload = function() {
        
        document.getElementById("login-form").addEventListener("submit", function(e) {
            e.preventDefault();
        });
        
        var loggedIn = api.isLoggedIn();
        var user = "";
        if (loggedIn) {
            user = api.getUserName();
            loadProfile(api.getUserInfo(user));
        } 
        else {
            logout();
        }
        
        document.getElementById("login").addEventListener("click", function(){
            document.getElementById("login-form").addEventListener("submit", function(e) {
                var username = document.getElementById("username").value;
                var password = document.getElementById("password").value;
                var data = api.login(username, password);
                if (Object.keys(data).length === 0) {
                    error("Incorrect login info");
                }
                else {
                    loggedIn = true;
                    user = username;
                    loadProfile(data);
                }
            }); 
        });
        
        document.getElementById("register").addEventListener("click", function(){
            document.getElementById("login-form").addEventListener("submit", function(e) {
                var username = document.getElementById("username").value;
                var password = document.getElementById("password").value;
                var data = api.register(username, password);
                loggedIn = true;
                user = username;
                data = api.updateProfile(user, user, data.password, "", "");
                loadEditProfile(data);
            });
        });
        
        document.getElementById("logout").addEventListener("click", function(){
            api.logout();
            loggedIn = false;
            user = "";
            logout();
        });
        
        document.getElementById("edit-profile").addEventListener("click", function(){
            var data = api.getUserInfo(user);
            loadEditProfile(data);
        });
        
        document.getElementById("add-event").addEventListener("click", function(){
            loadAddEvent();
        });
        
        
        
        document.getElementById("save-profile").addEventListener("click", function(){
            var newUser = document.getElementById("profile-username").value;
            var password = document.getElementById("profile-password").value;
            var fullname = document.getElementById("profile-fullname").value;
            var pic = document.getElementById("profile-picture").value;
            var data = api.updateProfile(user, newUser, password, fullname, pic);
            user = newUser;
            loadProfile(data);
        });
        
        document.getElementById("save-event").addEventListener("click", function(){
            var name = document.getElementById("event-name").value;
            var desc = document.getElementById("event-desc").value;
            var date = document.getElementById("event-date").value;
            var fee = document.getElementById("event-fee-input").value;
            var isPromo = document.getElementById("is-promo").checked;
            
            var data = api.addEvent("e"+guid(), name, desc, date, fee, isPromo);
            loadProfile(api.getUserInfo(user));
        });
        
        document.getElementById("cancel-event").addEventListener("click", function(){
            loadProfile(api.getUserInfo(user));
        });
        
        function loadProfile(data) {
            document.getElementById("login-form-container").style.display = "none";
            document.getElementById("edit-profile-form").style.display = "none";
            document.getElementById("profile-container").style.display = "flex";
            document.getElementById("edit-event-form").style.display = "none";
            
            document.getElementById("profile-user").innerHTML = user;
            document.getElementById("full-name").innerHTML = data.fullname;
            document.getElementById("profile-pic").style.background = "url(\"" + data.pic + "\")";
            document.getElementById("profile-pic").style.backgroundSize = "100% auto";
            document.getElementById("profile-pic").style.backgroundRepeat = "no-repeat";
            document.getElementById("profile-pic").style.backgroundPosition = "center";
            console.log(user, user.indexOf("-bo"));
            if (user.indexOf("-bo") > 0) {
                console.log("bo");
                document.getElementById("add-event").style.display = "show";
            }
            else {
                document.getElementById("add-event").style.display = "none";
            }
            
        }
        
        function loadEditProfile(data) {
            document.getElementById("login-form-container").style.display = "none";
            document.getElementById("edit-profile-form").style.display = "flex";
            document.getElementById("profile-container").style.display = "none";
            document.getElementById("edit-event-form").style.display = "none";
            document.getElementById("profile-username").value = user;
            document.getElementById("profile-password").value = data.password;
            document.getElementById("profile-fullname").value = data.fullname;
            document.getElementById("profile-picture").value = data.pic;
            
        }
        
        function loadAddEvent() {
            document.getElementById("login-form-container").style.display = "none";
            document.getElementById("edit-profile-form").style.display = "none";
            document.getElementById("profile-container").style.display = "none";
            document.getElementById("edit-event-form").style.display = "flex";
        }
        
        function logout() {
            document.getElementById("login-form-container").style.display = "flex";
            document.getElementById("edit-profile-form").style.display = "none";
            document.getElementById("profile-container").style.display = "none";
            
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        }
        
        function error(err) {
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        }
        
        /*https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript*/
        function guid() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    }
    
}());