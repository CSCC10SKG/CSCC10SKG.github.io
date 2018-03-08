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
        
        document.getElementById("save-profile").addEventListener("click", function(){
            var newUser = document.getElementById("profile-username").value;
            var password = document.getElementById("profile-password").value;
            var fullname = document.getElementById("profile-fullname").value;
            var pic = document.getElementById("profile-picture").value;
            var data = api.updateProfile(user, newUser, password, fullname, pic);
            user = newUser;
            loadProfile(data);
        });
        
        function loadProfile(data) {
            document.getElementById("login-form-container").style.display = "none";
            document.getElementById("edit-profile-form").style.display = "none";
            document.getElementById("profile-container").style.display = "flex";
            
            document.getElementById("profile-user").innerHTML = user;
            document.getElementById("full-name").innerHTML = data.fullname;
            document.getElementById("profile-pic").style.background = "url(\"" + data.pic + "\")";
            document.getElementById("profile-pic").style.backgroundSize = "100% auto";
            document.getElementById("profile-pic").style.backgroundRepeat = "no-repeat";
            document.getElementById("profile-pic").style.backgroundPosition = "center";
            
        }
        
        function loadEditProfile(data) {
            document.getElementById("login-form-container").style.display = "none";
            document.getElementById("edit-profile-form").style.display = "flex";
            document.getElementById("profile-container").style.display = "none";
            document.getElementById("profile-username").value = user;
            document.getElementById("profile-password").value = data.password;
            document.getElementById("profile-fullname").value = data.fullname;
            document.getElementById("profile-picture").value = data.pic;
            
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
    }
    
}());