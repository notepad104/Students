Students = new Mongo.Collection('students');
if (Meteor.isClient) {
    error = ''
    trimInput = function(value) {
        return value.replace(/^\s*|\s*$/g, '');
    };

    isNotEmpty = function(value) {
        if (value && value !== ''){
            return true;
        }
        error = 'Please fill in all required fields';
        return false;
    };

    isEmail = function(value) {
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(value)) {
            return true;
        }
        error = 'Please enter a valid email address.';
        return false;
    };

    isValidPassword = function(password) {
        if (password.length < 6) {
            error = 'Your password should be 6 characters or longer.';
            return false;
        }
        return true;
    };

    areValidPasswords = function(password, confirm) {
        if (!isValidPassword(password)) {
            return false;
        }
        if (password !== confirm) {
            error = 'Your two passwords are not equivalent.';
            return false;
        }
        return true;
    };
        

    Template.LoginSignUp.events({
      'submit #signupform': function(e, t) {
        e.preventDefault();
        error = '';
        var signUpForm = $(e.currentTarget),
            email = trimInput(signUpForm.find('#signUpEmail').val().toLowerCase()),
            password = signUpForm.find('#signUpPassword').val(),
            passwordConfirm = signUpForm.find('#signUpPasswordConfirm').val(),
            fname = signUpForm.find('#signUpFname').val(),
            lname = signUpForm.find('#signUpLname').val();

        if (isNotEmpty(email) && isNotEmpty(password) && isEmail(email) && areValidPasswords(password, passwordConfirm)) {

          Accounts.createUser({fname: fname, lname: lname, email: email, password: password}, function(err) {
            if (err) {
                if(error == '')
                    error = err.message;
                $("#signupalert").html(error).css('display', 'block');
              if (err.message === 'Email already exists. [403]') {
                console.log('We are sorry but this email is already used.');
              } else {
                console.log(err);
              }
            } 
            else {
              console.log('Congrats new , you\'re in!');
              Meteor._reload.reload();
            }
          });

        }
        if(error != '')
            $("#signupalert").html(error).css('display', 'block');
        return false;
      },

      'submit #loginform': function(e, t) {
        e.preventDefault();
        error = '';
        var signInForm = $(e.currentTarget),
              email = trimInput(signInForm.find('#signInEmail').val().toLowerCase()),
              password = signInForm.find('#signInPassword').val();
           //   console.log(password);
        if (isNotEmpty(email) && isEmail(email) && isNotEmpty(password) && isValidPassword(password)) {

          Meteor.loginWithPassword(email, password, function(err) {
           // console.log(password);

            if (err) {
                if(error == '')
                    error = err.message;
                $("#login-alert").html(error).css('display', 'block');
              console.log('These credentials are not valid.');

            } else {
              console.log('Welcome back !');
              Meteor._reload.reload();
            }
          });

        }
        if(error != '')
            $("#login-alert").html(error).css('display', 'block');
        return false;
      },

    });

    Template.nav.events({
      'click #signOut': function(e, t) {

        Meteor.logout(function() {
          console.log('Bye ! Come back whenever you want!');
        Meteor._reload.reload();
        });

        return false;
      },
      'click #list': function(e, t) {
          Meteor._reload.reload();
      },
      'click #add': function(e, t) {
          Meteor._reload.reload();
      },

    });

Template.home.rendered = function() {
    if(!this._rendered) {
      this._rendered = true;
      console.log('aaa')
      Session.setDefault('id', 'timestamp')
      Session.setDefault('timestamp', -1)
      Session.setDefault('fname', 0)
      Session.setDefault('lname', 0)
      Session.setDefault('place', 0)
      Session.setDefault('contact', 0)
      Session.setDefault('email', 0)
    }
}


    Template.addStudent.events({
        'submit #addstudent': function (e, t) {
         //   e.preventDefault();
            var form = $(e.currentTarget),
                fname = trimInput(form.find('#add-fname').val()),
                lname = trimInput(form.find('#add-lname').val()),
                email = trimInput(form.find('#add-email').val().toLowerCase()),
                phone = form.find('#add-phone').val(),
                place = form.find('#add-place').val()
                data = {
                                "timestamp" : new Date(),
                                "fname" : fname,
                                "lname" : lname,
                                "email" : email,
                                "phone": phone,
                                "place" : place,
                                "user": Meteor.userId()
                      }
                Students.insert(data);
        //    Meteor._reload.reload();

          Session.set('inserted', true)
          setTimeout(function(){
            Session.set('inserted', false)
          }, 5000);
          
        },
    });


    Template.home.helpers({
        'studentName':function(){
           //console.log(Students.find({}, {sort: { timestamp: -1}}).fetch());
            id  = Session.get('id')
            return Students.find({}, {sort: {id : Session.get(id) } })      
        },

        'studentUser':function(){
          return Meteor.userId();
        },
        
        'isNotification':function(){
            return Session.get('inserted')
        }
    });

      Template.home.events({
        'click #edit-student': function (e, t){
            //   e.preventDefault();
               Meteor._reload.reload();
        },

        'click fname':function(e, t){
            Session.set('id' , 'fname')
            id = Session.get(id)
            if(Session.get(id) == 1)
              Session.set(id, 1)
            else
              Session.set(id, 1)
        },
        'click lname':function(e, t){
            Session.set('id' , 'lname')
            id = Session.get(id)
            if(Session.get(id) == 1)
              Session.set(id, 1)
            else
              Session.set(id, 1)
        },
        'click place':function(e, t){
            Session.set('id' , 'place')
            id = Session.get(id)
            if(Session.get(id) == 1)
              Session.set(id, 1)
            else
              Session.set(id, 1)
        },
        'click phone':function(e, t){
            Session.set('id' , 'phone')
            id = Session.get(id)
            if(Session.get(id) == 1)
              Session.set(id, 1)
            else
              Session.set(id, 1)
        },
        'click email':function(e, t){
            Session.set('id' , 'email')
            id = Session.get(id)
            if(Session.get(id) == 1)
              Session.set(id, 1)
            else
              Session.set(id, 1)
        }
    });
    Template.editStudent.events({
        'submit': function (e, t) {
           // e.preventDefault();
           var form = $(e.currentTarget),
                fname = trimInput(form.find('#edit-fname').val()),
                lname = trimInput(form.find('#edit-lname').val()),
                email = trimInput(form.find('#edit-email').val().toLowerCase()),
                phone = form.find('#edit-phone').val(),
                place = form.find('#edit-place').val()

                Students.update({_id: id}, {
                                "fname" : fname,
                                "lname" : lname,
                                "email" : email,
                                "phone": phone,
                                "place" : place
                });
            //    Meteor._reload.reload();
        },
    });

    if(Meteor.userId()){
       Router.map(function () {
           this.route('addStudent', {
                path: '/addstudent'
            }); 

            this.route('home', {
                path: '/'
            }); 

           this.route('editStudent', {
                path: '/addstudent/edit/:id',
                data: function(){
                    id = this.params.id;
                    return Students.findOne({_id: this.params.id});
                }
            });

           this.route('deleteStudent', {
                path: '/addstudent/delete/:id',
                data: function(){
                    id = this.params.id;
                     var confirmDelete = window.confirm('Do you want to delete the contact ?');
                    Router.go('home');
                    if(confirmDelete)
                    return Students.remove({_id: this.params.id});
                }
                
            });

         });

    }
    else{
        Router.route('/', function () {
            this.render(Template.LoginSignUp);
        });   
          Router.route('/addcontact', function () {
            this.render(Template.LoginSignUp);
        });
          Router.route('/addcontact/edit/:id', function () {
            this.render(Template.LoginSignUp);
        });
            Router.route('/addcontact/delete/:id', function () {
            this.render(Template.LoginSignUp);
        });
    }

}

if (Meteor.isServer) {
  
  Meteor.startup(function () {
    // code to run on server at startup
  //UserAccounts.remove({});
    
  });
}