//Setting up input forms
//Users
// User Variables
var user = document.getElementById( "user" );
var email = document.getElementById( "email" );
var userlocation = document.getElementById( "user_location" );
var userpassword = document.getElementById( "user_password" );
// Create User  
function createuser_submit() { /*Only called if email and zip inputs are found to be valid  */
  var firebaseRef = firebase.database().ref();
  var un = user.value;
  var ue = email.value;
  var ul = userlocation.value;
  var ucd = ( new Date() ).toString();
  var ur = 1;
  var password = userpassword.value;
  //Create User with Email and Password
  firebase.auth().createUserWithEmailAndPassword( ue, password ).then( function success( user ) {
    //Clear Previous Email Check
    var $result = $( "#useremailresult" );
    var email = $( "#email" ).val();
    $result.text( "" );
    var uid = user.user.uid; //Pull user id which has just been created
    firebaseRef.child( "Users" ).child( uid ).set( {
      uid,
      un,
      ue,
      ul,
      ucd,
      ur
    } ); //Send user data to database
  } ).catch( function( error ) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log( errorCode );
    console.log( errorMessage );
    var $result = $( "#useremailresult" );
    var email = $( "#email" ).val();
    $result.text( "Either this email address is already exists in our system or your password is not long enough" ); //Send error if that particular email address already exists
  } );
}
// Update User Password
function updatepassword() {
  var userpassword = document.getElementById( "update_password" );
  var user = firebase.auth().currentUser;
  var newPassword = userpassword.value;
  user.updatePassword( newPassword ).then( function() {
    // Update successful.
  } ).catch( function( error ) {
    // An error happened.
  } );
}
$( "#updatepassword" ).on( "click", updatepassword ); /*No validation currently included*/
// Send Receipt Password Email
function email_reset() {
  var useremail = document.getElementById( "user_email_reset" );
  var auth = firebase.auth();
  auth.sendPasswordResetEmail( useremail.value ).then( function() {
    // Email sent.
    console.log( 'Email Sent' );
  } ).catch( function( error ) {
    // An error happened.
  } );
}
$( "#useremailreset" ).on( "click", email_reset ); /*No validation currently included*/
//Delete User
function delete_user_step1() {
  var x = document.getElementById( "delete_user_1" );
  var y = document.getElementById( "delete_user_2" );
  x.style.display = "none";
  y.style.display = "block";
}

function delete_user_step2() {
  var firebaseRef = firebase.database().ref();
  var user = firebase.auth().currentUser;
  var uid = user.uid;
  var ur = 0; //Set user to delete   
  firebaseRef.child( "Users" ).child( uid ).child( "ur" ).set( ur ); //Set user role to zero to indicate that user has deleted their account
  user.delete().then( function() {
    // User deleted.
    console.log( 'User Deleted' );
  } ).catch( function( error ) {
    // An error happened.
  } );
}
$( "#delete_user_1" ).on( "click", delete_user_step1 );
$( "#delete_user_2" ).on( "click", delete_user_step2 );
//Sign in User
function signin() {
  var email = document.getElementById( "emailsignin" ).value;
  var password = document.getElementById( "passwordsignin" ).value;
  var $result = $( "#loginresult" );
  $result.text( "" );
  //Sign In User with Email and Password
  firebase.auth().signInWithEmailAndPassword( email, password ).catch( function( error ) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log( errorCode );
    console.log( errorMessage );
    var $result = $( "#loginresult" );
    $result.text( "Log-in Attempt Failed" );
  } );
  var x = document.getElementById( "notloggedin" ); /*Hide login page when users log in*/
  x.style.display = "none";
  var y = document.getElementById( "signout" ); /*Show sign out when logging in*/
  y.style.display = "block";
  setTimeout( function() {
    location.reload();
  }, 1000 ); //Reload page when you signin
}
$( "#usersignin" ).on( "click", signin ); /*Sign in user*/
//Sign user out
function signout() {
  firebase.auth().signOut().then( function() {
    // Sign-out successful.
    console.log( 'User Logged Out!' );
  } ).catch( function( error ) {
    // An error happened.
    console.log( error );
  } );
  var x = document.getElementById( "notloggedin" ); /*Show login page when users logs out*/
  x.style.display = "block";
  var y = document.getElementById( "signout" ); /*Hide sign out when logging out*/
  y.style.display = "none";
  setTimeout( function() {
    location.reload();
  }, 1000 ); //Reload page when you sign out
}
$( "#usersignout" ).on( "click", signout ); /*Sign user out*/
//End of Users
//Venues
// Venue Variables
var venuename = document.getElementById( "venue_name" );
var venueemail = document.getElementById( "venue_email" );
var venuelocation = document.getElementById( "venue_location" );
var venuephonenumber = document.getElementById( "venue_phonenumber" );
// Venue
function createvenue_submit() { /*Only called if email, phone, and zip inputs are found to be valid  */
  var firebaseRef = firebase.database().ref();
  var vn = venuename.value;
  var vl = venuelocation.value;
  var vcd = ( new Date() ).toString();
  // var venue_id = "v"+(Math.round((Date.now() + Math.random())*100)); //Create random venue ID
  var vid = "v" + ( Math.round( ( Date.now() + Math.random() ) * 100 ) ); //Create random venue ID
  var key = firebase.auth().currentUser.uid;
  var user = firebase.auth().currentUser;
  var uid = user.uid
  firebaseRef.child( "Users" ).child( uid ).child( "un" ).set( vn );
  firebaseRef.child( "Venues" ).child( vid ).set( {
    vid,
    vn,
    vl,
    vcd,
    key

  } ); //Send venue data to database
  var firebaseRef = firebase.database().ref();
  var user = firebase.auth().currentUser;
  var uid = user.uid;
  var ur = 3; //Set venue to active   
  firebaseRef.child( "Users" ).child( uid ).child( "ur" ).set( ur ); //Change venue from pending to active
  var x = document.getElementById( "drink" );
  var y = document.getElementById( "venue" );
  x.style.display = "block";
  y.style.display = "none";


}
//Upgrade general user to venue account
var upgrade_key = document.getElementById( "upgradeaccount" );

function upgrade() {
  var upgradekey = upgrade_key.value;
  var firebaseRef = firebase.database().ref();
  firebaseRef.child( "UpgradeTokens" ).orderByChild( "id" ).equalTo( upgradekey ).limitToFirst( 1 ).once( "value", snapshot => {
    if ( snapshot.exists() ) {
      var user = firebase.auth().currentUser;
      var uid = user.uid;
      var ur = 2; //Set venue to active  
      firebaseRef.child( "Users" ).child( uid ).child( "ur" ).set( ur ); //Change user to pending venue
      snapshot.forEach( ( function( child ) {
        indexData = child.key;
      } ) );
      status = "0";
      claim_date = ( new Date() ).toString();
      firebaseRef.child( "UpgradeTokens" ).child( indexData ).child( "status" ).set( status ); //Change user to pending venue
      firebaseRef.child( "UpgradeTokens" ).child( indexData ).child( "claim_date" ).set( claim_date ); //Define claim date
      firebaseRef.child( "UpgradeTokens" ).child( indexData ).child( "venue" ).set( uid ); //Define claim date
    } else {
      var x = document.getElementById( "upgraderesult" );
      x.style.display = "block";
      var x = document.getElementById( "venue" );
      x.style.display = "block";
    }
  } );

  var x = document.getElementById("userpending");     /*Show error if user is not logged in*/
  x.style.display = "block";
}
$( "#upgrade" ).on( "click", upgrade ); /*Sign user out*/
//End of Venues
//Drinks
//Drink Variables
var drinkname = document.getElementById( "drink_name" );
var drinkstyle = document.getElementById( "drink_style" );
var drinkabv = document.getElementById( "drink_abv" );
var drinkibu = document.getElementById( "drink_ibu" );
var drinkdescription = document.getElementById( "drink_description" );
//Create Drinks
function createdrink_submit() {
  var firebaseRef = firebase.database().ref();
  var dn = drinkname.value;
  var ds = drinkstyle.value;
  var da = drinkabv.value;
  var di = drinkibu.value;
  var dd = drinkdescription.value;
  var dcd = ( new Date() ).toString();
  var did = "d" + ( Math.round( ( Date.now() + Math.random() ) * 100 ) ); //Create random drink ID
  var user = firebase.auth().currentUser.uid;
  firebase.database().ref( "Users" ).child( user ).child( "un" ).on( 'value', function( snapshot ) { //Get user role of current user (1=general user, 2=pending venue, 3=active user, 4=super user)
    venue = snapshot.val();
    firebaseRef.child( "Drinks" ).child( did ).update( {
      venue
    } ); //Send drink data to database
  } );
  firebaseRef.child( "Drinks" ).child( did ).update( {
    did,
    dn,
    ds,
    da,
    di,
    dcd,
    dd
  } ); //Send drink data to database

  var x = document.getElementById( "beeradded" );
  x.style.display = "block";

  setTimeout( function() {
    x.style.display = "none";
  }, 5000 ); //gif while loading

}
$( "#createdrink" ).on( "click", createdrink_submit ); /*No validation currently included*/
//End of Drinks
//End inputs
//Validate
//Validate Email Address
function validateEmail( email ) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test( email );
}
//End of Email Validation
//Validate Phone
function validatephone( phone ) {
  var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return phoneno.test( phone );
}
//
//Validate Zipcode
function validatezip( zip ) {
  var zipno = /^\d{5}$|^\d{5}-\d{4}$/;
  return zipno.test( zip );
}
//
//Validate User Email
function validate_user() {
  var $result = $( "#useremailresult" );
  var email = $( "#email" ).val();
  $result.text( "" );
  var $zipresult = $( "#userzipresult" );
  var zip = $( "#user_location" ).val();
  $zipresult.text( "" );
  if ( validateEmail( email ) && validatezip( zip ) ) {
    createuser_submit(); /*If both are valid then submit*/
  } else {
    if ( validateEmail( email ) ) {} /*If email is valid move on*/
    else { /*If email isn't valid throw error*/
      $result.text( email + " is not valid email :(" );
      $result.css( "color", "red" );
    }
    if ( validatezip( zip ) ) {} /*If phone is valid move on*/
    else { /*If phone isn't valid throw error*/
      $zipresult.text( zip + " is not valid zip code :(" );
      $zipresult.css( "color", "red" );
    }
  }
  return false;
}
$( "#createuser" ).on( "click", validate_user ); /*Run validation on click*/
//End of Validating User Email
//Validate Venue Email and Phone
function validate_venue() {
  var $phoneresult = $( "#venuephoneresult" );
  var phone = $( "#venue_phonenumber" ).val();
  $phoneresult.text( "" );
  var $zipresult = $( "#venuezipresult" );
  var zip = $( "#venue_location" ).val();
  $zipresult.text( "" );
  if ( validatephone( phone ) && validatezip( zip ) ) {
    createvenue_submit(); /*If both are valid then submit*/
  } else {
    if ( validatephone( phone ) ) {} /*If phone is valid move on*/
    else { /*If phone isn't valid throw error*/
      $phoneresult.text( phone + " is not valid phone number :(" );
      $phoneresult.css( "color", "red" );
    }
    if ( validatezip( zip ) ) {} /*If phone is valid move on*/
    else { /*If phone isn't valid throw error*/
      $zipresult.text( zip + " is not valid zip code :(" );
      $zipresult.css( "color", "red" );
    }
  }
  return false;
}
$( "#createvenue" ).on( "click", validate_venue ); /*Run validation on click*/
//End of Validating Venue Email and Phone
//End of All Validations
// Load Data
$( document ).ready( function() {
  var venue_name = [];
  loading();
  var ref = firebase.database().ref( "Venues" );
  ref.once( 'value', function( snapshot ) {
    snapshot.forEach( function( childSnapshot ) {
      var tr;
      var td = document.createElement( 'td' );
      tr = document.createElement( 'tr' );
      document.getElementById( 'venue_table' ).appendChild( tr );
      var link = document.createElement( "div" );
      link.appendChild( document.createTextNode( childSnapshot.child( "vn" ).val() ) );
      link.onclick = "#";
      var venue_name_input = ( childSnapshot.child( "vn" ).val() );
      link.onclick = function() {
        loadBeers( childSnapshot.child( "vn" ).val(), venue_name_input );
      };
      td.appendChild( link );
      tr.appendChild( td );
    } );
  } );
 
  //Check what level the user is
  setTimeout( function() {
    var user = firebase.auth().currentUser.uid; //Get current user ID
    firebase.database().ref( "Users" ).child( user ).child( "ur" ).on( 'value', function( snapshot ) { //Get user role of current user (1=general user, 2=pending venue, 3=active user, 4=super user)
      if ( snapshot.val() == 1 ) { //if general user show venue table
        var x = document.getElementById( "venue_table" );
        x.style.display = "block";
        var x = document.getElementById( "user_management" );
        x.style.display = "block";
        var x = document.getElementById("accordionbeer");     /*Show error if user is not logged in*/
        x.style.display = "none";
      } else if ( snapshot.val() == 2 ) { //if pending venue show venue details page and venue table
        var x = document.getElementById( "venue" );
        x.style.display = "block";
        var x = document.getElementById( "venue_table" );
        x.style.display = "block";
        var x = document.getElementById( "user_management" );
        x.style.display = "block";
        var x = document.getElementById("accordionbeer");     /*Show error if user is not logged in*/
        x.style.display = "none";
        var x = document.getElementById("userpending");     /*Show error if user is not logged in*/
        x.style.display = "block";
      } else if ( snapshot.val() == 3 ) { //if active venue show add beer list and venue table
        var x = document.getElementById( "drink" );
        x.style.display = "block";
        var x = document.getElementById( "venue_table" );
        x.style.display = "block";
        var x = document.getElementById( "user_management" );
        x.style.display = "block";
        var x = document.getElementById( "usernav" );
        x.style.display = "none";
        var x = document.getElementById( "accordion2" );
        x.style.display = "none";
        var x = document.getElementById( "brewerynav" );
        x.style.display = "block";
        // Load venues beers
        editbeers_prepare( user );
      }
    } );
  }, 1000 );
} );

// Load Beers Associated with Venue
function loadBeers( input, venuename ) { //Click the link to show the beers
  document.getElementById( "drink_table" ).innerHTML = ""; //Remove table content when you choose a new brewery
  document.getElementById( "venue_name_display" ).innerHTML = ""; //Remove venue name when you choose a new brewery
  var ven = input; //Make variable linking to selected venue
  var venuecurrent = venuename; //Make variable linking to selected venue name
  document.getElementById( "venue_name_display" ).innerHTML = venuecurrent; //Load Venue Name
  var ref = firebase.database().ref( "Drinks" ); //Make connection to drinks table
  ref.once( 'value', function( snapshot ) { //Cycle through drinks
    snapshot.forEach( function( childSnapshot ) {
      if ( childSnapshot.child( "venue" ).val() == ven ) { //Only include drinks associated with venue
        //Create Columns and Rows
        var tr;
        var td = document.createElement( 'td' );
        var td2 = document.createElement( 'td' );
        var td3 = document.createElement( 'td' );
        var td4 = document.createElement( 'td' );
        var td5 = document.createElement( 'td' );
        var td6 = document.createElement( 'td' );
        var tdwatchlist = document.createElement('td');   //add to watch list
        tr = document.createElement( 'tr' );
        //Start building tables
        document.getElementById( 'drink_table' ).appendChild( tr );
        var drinkdetail1 = document.createElement( "h4" );
        var drinkdetail2 = document.createElement( "p" );
        var drinkdetail3 = document.createElement( "p" );
        var drinkdescriptiontext = document.createElement( "p" );
        var watchlist = document.createElement("a");
        var firebaseRef = firebase.database().ref();
        var uid = firebase.auth().currentUser.uid;
        var current_beer = childSnapshot.child( "did" ).val();
        var current_venue = childSnapshot.child( "venue" ).val();
        //See if that particular beer has been rated by the current user
        firebaseRef.child( "Users" ).child( uid ).child( "rating" ).child( current_beer ).once( "value", snapshot => {
          if ( snapshot.child( "rating" ).val() == "1" ) { //If rated positive and color cell
            var like = document.createElement( "a" );
            like.appendChild( document.createTextNode( '\uD83D\uDC4D' ) );
            like.onclick = function() {
              likedrink( current_beer, current_venue );
              td4.setAttribute( "style", "background-color: green;" );
              td5.setAttribute( "style", "background-color: none;" );
            };
            td4.appendChild( like );
            td4.setAttribute( "style", "background-color:green" );
            like.setAttribute( "style", "font-size:1em" );
            var dislike = document.createElement( "a" );
            dislike.onclick = function() {
              dislikedrink( current_beer, current_venue );
              td5.setAttribute( "style", "background-color: red;" );
              td4.setAttribute( "style", "background-color: none;" );
            };
            dislike.appendChild( document.createTextNode( "\uD83D\uDC4E" ) );
            td5.appendChild( dislike );
          } else if ( snapshot.child( "rating" ).val() == "-1" ) { //If rated negative color cell
            var dislike = document.createElement( "a" );
            dislike.appendChild( document.createTextNode( "\uD83D\uDC4E" ) );
            dislike.onclick = function() {
              dislikedrink( current_beer, current_venue );
              td5.setAttribute( "style", "background-color: red;" );
              td4.setAttribute( "style", "background-color: none;" );
            };
            td5.appendChild( dislike );
            td5.setAttribute( "style", "background-color:red" );
            dislike.setAttribute( "style", "font-size:1em" );
            var like = document.createElement( "a" );
            like.onclick = function() {
              likedrink( current_beer, current_venue );
              td4.setAttribute( "style", "background-color: green;" );
              td5.setAttribute( "style", "background-color: none;" );
            };
            like.appendChild( document.createTextNode( '\uD83D\uDC4D' ) );
            td4.appendChild( like );
          } else {
            var like = document.createElement( "a" );
            like.onclick = function() {
              likedrink( current_beer, current_venue );
              td4.setAttribute( "style", "background-color: green;" );
              td5.setAttribute( "style", "background-color: none;" );
            };
            like.appendChild( document.createTextNode( '\uD83D\uDC4D' ) );
            td4.appendChild( like );
            var dislike = document.createElement( "a" );
            dislike.onclick = function() {
              dislikedrink( current_beer, current_venue );
              td5.setAttribute( "style", "background-color: red;" );
              td4.setAttribute( "style", "background-color: none;" );
            };
            dislike.appendChild( document.createTextNode( "\uD83D\uDC4E" ) );
            td5.appendChild( dislike );
          }
        } );
        //Define what will be added to columns
        drinkdetail1.appendChild( document.createTextNode( childSnapshot.child( "dn" ).val() ) );
        drinkdetail2.appendChild( document.createTextNode( ( "ABV: " + childSnapshot.child( "da" ).val() ) ) );
        drinkdetail3.appendChild( document.createTextNode( ( "IBU: " + childSnapshot.child( "di" ).val() ) ) );
        drinkdescriptiontext.appendChild( document.createTextNode( childSnapshot.child( "dd" ).val() ) );
        watchlist.appendChild( document.createTextNode("Add to Watch List"));
          watchlist.onclick = function() {              //add specific beer to watch list
          addtowatchlist( current_beer, current_venue );
          this.style.backgroundColor='green';
          this.innerHTML="In Watch List"
          };

          tdwatchlist.appendChild(watchlist);

        td.appendChild( drinkdetail1 ); //Add details to column
        td2.appendChild( drinkdetail2 );
        td3.appendChild( drinkdetail3 );
        td6.appendChild( drinkdescriptiontext );
        tr.appendChild( td );
        td.classList.add( "class1" ); //Add class to column
        tr.appendChild(tdwatchlist);
        tdwatchlist.classList.add("tdwatchlist");

        firebaseRef.child( "Users" ).child( uid ).child( "watch" ).child( current_beer ).once( "value", snapshot => {
          if (snapshot.hasChild("beer")){
            watchlist.style.backgroundColor = "green"
            watchlist.innerHTML="In Watch List"
            watchlist.onclick = null;
          }
        })
        
        tr.appendChild( td2 );
        td2.classList.add( "class2" );
        tr.appendChild( td3 );
        td3.classList.add( "class3" );
        tr.appendChild( td4 );
        td4.classList.add( "class4" );
        tr.appendChild( td5 );
        td5.classList.add( "class5" );
        tr.appendChild( td6 );
        td6.classList.add( "class6" );

        var x = document.getElementById( "venue_table" ); //hide venue table when show drinks
        x.style.display = "block";
        moveTo( ".main", 2 );
      }
    } );
  } );
}
//Start of beer rating section
//Add liked links to users profiles
function likedrink( beerinput, venueinput ) {
  var firebaseRef = firebase.database().ref();
  var uid = firebase.auth().currentUser.uid;
  var beer = beerinput;
  var venue = venueinput;
  var rating = "1";
  var rate_date = ( new Date() ).toString();
  firebaseRef.child( "Users" ).child( uid ).child( "rating" ).child( beer ).set( {
    rate_date,
    beer,
    rating,
    venue
  } ); //Send rating
}
//Add disliked links to users profiles
function dislikedrink( beerinput, venueinput ) {
  var firebaseRef = firebase.database().ref();
  var uid = firebase.auth().currentUser.uid;
  var beer = beerinput;
  var venue = venueinput;
  var rating = "-1"
  var rate_date = ( new Date() ).toString();
  firebaseRef.child( "Users" ).child( uid ).child( "rating" ).child( beer ).set( {
    rate_date,
    beer,
    rating,
    venue
  } ); //Send rating
}

//Add watchlist to users profiles
function addtowatchlist( beerinput, venueinput ) {
  var firebaseRef = firebase.database().ref();
  var uid = firebase.auth().currentUser.uid;
  var beer = beerinput;
  var venue = venueinput;
  var rating = "-1"
  var rate_date = ( new Date() ).toString();
  firebaseRef.child( "Users" ).child( uid ).child( "watch" ).child( beer ).set( {
    rate_date,
    beer,
    venue
  } ); //Send to watch list
}

//Add watchlist to users profiles
function removefromwatch( beerinput, venueinput ) {
  var firebaseRef = firebase.database().ref();
  var uid = firebase.auth().currentUser.uid;
  var beer = beerinput;
  var venue = venueinput;
  var rating = "-1"
  var rate_date = ( new Date() ).toString();
  firebaseRef.child( "Users" ).child( uid ).child( "watch" ).child( beer ).remove(); //Remove from watch list
}

//End of beer rating section
// End of Loading of Beer Associated with Venue
// Load personal favoirtes
function loadpersonal() {
  document.getElementById( "personaltable" ).innerHTML = ""; //Remove table content when you choose a new brewery
  var uid = firebase.auth().currentUser.uid;
  var ref = firebase.database().ref( "Users" ).child( uid ).child( "rating" ).orderByChild( "venue" ); //Make connection to user table
  ref.once( 'value', function( snapshot ) { //Cycle through user table
    snapshot.forEach( function( childSnapshot ) {
      if ( childSnapshot.child( "rating" ).val() == 1 ) { //Only include drinks associated with venue
        //Create Columns and Rows
        var tr;
        var tdbrewery = document.createElement( 'td' );
        var td = document.createElement( 'td' );
        var td2 = document.createElement( 'td' );
        var td3 = document.createElement( 'td' );
        var td4 = document.createElement( 'td' );
        var td5 = document.createElement( 'td' );
        var td6 = document.createElement( 'td' )
        tr = document.createElement( 'tr' );
        //Start building tables
        document.getElementById( 'personaltable' ).appendChild( tr );
        var brewerydetail1 = document.createElement( "h4" );
        var drinkdetail1 = document.createElement( "h4" );
        var drinkdetail2 = document.createElement( "p" );
        var drinkdetail3 = document.createElement( "p" );
        var drinkdescriptiontext = document.createElement( "p" )
        var firebaseRef = firebase.database().ref();
        var uid = firebase.auth().currentUser.uid;
        var current_beer = childSnapshot.child( "beer" ).val();
        //Find data associated with the current popular beer
        firebaseRef.child( "Drinks" ).child( current_beer ).once( "value", beersnapshot => {
          //Define what will be added to columns
          drinkdetail1.appendChild( document.createTextNode( beersnapshot.child( "dn" ).val() ) );
          drinkdetail2.appendChild( document.createTextNode( ( "ABV: " + beersnapshot.child( "da" ).val() ) ) );
          drinkdetail3.appendChild( document.createTextNode( ( "IBU: " + beersnapshot.child( "di" ).val() ) ) );
          drinkdescriptiontext.appendChild( document.createTextNode( beersnapshot.child( "dd" ).val() ) );
        } )
        firebaseRef.child( "Drinks" ).child( current_beer ).once( "value", venuesnapshot => {
          current_venue = venuesnapshot.child( "venue" ).val();
          drinkdetail1.appendChild( document.createTextNode( current_venue + " - " ) );
        } )
        var like = document.createElement( "a" );
        like.appendChild( document.createTextNode( '' ) );
        like.onclick = function() {
          likedrink( current_beer, current_venue );
          td4.setAttribute( "style", "background-color: green;" );
          td5.setAttribute( "style", "background-color: none;" )
        };
        td4.appendChild( like );
        td4.setAttribute( "style", "background-color:green" );
        like.setAttribute( "style", "font-size:1em" );
        var dislike = document.createElement( "a" );
        dislike.onclick = function() {
          dislikedrink( current_beer, current_venue );
          td5.setAttribute( "style", "background-color: red;" );
          td4.setAttribute( "style", "background-color: none;" )
        };
        dislike.appendChild( document.createTextNode( "REMOVE" ) );
        td5.setAttribute( "style", "background-color:red;width:20vw !important" );
        td5.appendChild( dislike );
        tdbrewery.appendChild( brewerydetail1 );
        td.appendChild( drinkdetail1 ); //Add details to column
        td2.appendChild( drinkdetail2 );
        td3.appendChild( drinkdetail3 );
        td6.appendChild( drinkdescriptiontext );
        tr.appendChild( tdbrewery );
        tr.appendChild( td );
        td.classList.add( "class1fav" ); //Add class to column
        tr.appendChild( td2 );
        td2.classList.add( "class2fav" );
        tr.appendChild( td3 );
        td3.classList.add( "class3fav" );
        // tr.appendChild(td4);
        // td4.classList.add("class4");
        tr.appendChild( td5 );
        td5.classList.add( "class5fav" );
        tr.appendChild( td6 );
        td6.classList.add( "class6fav" )
      }
    } )
  } )
}

//End of loading personal favorites


// Load personal watchlist
function loadwatchlist() {
  document.getElementById( "watchlisttable" ).innerHTML = ""; //Remove table content when you choose a new brewery
  var uid = firebase.auth().currentUser.uid;
  var ref = firebase.database().ref( "Users" ).child( uid ).child( "watch" ).orderByChild( "venue" ); //Make connection to user table
  ref.once( 'value', function( snapshot ) { //Cycle through user table
    snapshot.forEach( function( childSnapshot ) {
      
        //Create Columns and Rows
        var tr;
        var tdbrewery = document.createElement( 'td' );
        var td = document.createElement( 'td' );
        var td2 = document.createElement( 'td' );
        var td3 = document.createElement( 'td' );
        var td4 = document.createElement( 'td' );
        var td5 = document.createElement( 'td' );
        var td6 = document.createElement( 'td' )
        tr = document.createElement( 'tr' );
        //Start building tables
        document.getElementById( 'watchlisttable' ).appendChild( tr );
        var brewerydetail1 = document.createElement( "h4" );
        var drinkdetail1 = document.createElement( "h4" );
        var drinkdetail2 = document.createElement( "p" );
        var drinkdetail3 = document.createElement( "p" );
        var drinkdescriptiontext = document.createElement( "p" )
        var firebaseRef = firebase.database().ref();
        var uid = firebase.auth().currentUser.uid;
        var current_beer = childSnapshot.child( "beer" ).val();
        //Find data associated with the current popular beer
        firebaseRef.child( "Drinks" ).child( current_beer ).once( "value", beersnapshot => {
          //Define what will be added to columns
          drinkdetail1.appendChild( document.createTextNode( beersnapshot.child( "dn" ).val() ) );
          drinkdetail2.appendChild( document.createTextNode( ( "ABV: " + beersnapshot.child( "da" ).val() ) ) );
          drinkdetail3.appendChild( document.createTextNode( ( "IBU: " + beersnapshot.child( "di" ).val() ) ) );
          drinkdescriptiontext.appendChild( document.createTextNode( beersnapshot.child( "dd" ).val() ) );
        } )
        firebaseRef.child( "Drinks" ).child( current_beer ).once( "value", venuesnapshot => {
          current_venue = venuesnapshot.child( "venue" ).val();
          drinkdetail1.appendChild( document.createTextNode( current_venue + " - " ) );
        } )
        var like = document.createElement( "a" );
        like.appendChild( document.createTextNode( '' ) );
        like.onclick = function() {
          likedrink( current_beer, current_venue );
          td4.setAttribute( "style", "background-color: green;" );
          td5.setAttribute( "style", "background-color: none;" )
        };
        td4.appendChild( like );
        td4.setAttribute( "style", "background-color:green" );
        like.setAttribute( "style", "font-size:1em" );
        var dislike = document.createElement( "a" );
        dislike.onclick = function() {
          removefromwatch( current_beer, current_venue ); this.parentElement.parentElement.style.display='none';;
          td5.setAttribute( "style", "background-color: red;" );
          td4.setAttribute( "style", "background-color: none;" )
        };
        dislike.appendChild( document.createTextNode( "REMOVE" ) );
        td5.setAttribute( "style", "background-color:red;width:20vw !important" );
        td5.appendChild( dislike );
        tdbrewery.appendChild( brewerydetail1 );
        td.appendChild( drinkdetail1 ); //Add details to column
        td2.appendChild( drinkdetail2 );
        td3.appendChild( drinkdetail3 );
        td6.appendChild( drinkdescriptiontext );
        tr.appendChild( tdbrewery );
        tr.appendChild( td );
        td.classList.add( "class1fav" ); //Add class to column
        tr.appendChild( td2 );
        td2.classList.add( "class2fav" );
        tr.appendChild( td3 );
        td3.classList.add( "class3fav" );
        // tr.appendChild(td4);
        // td4.classList.add("class4");
        tr.appendChild( td5 );
        td5.classList.add( "class5fav" );
        tr.appendChild( td6 );
        td6.classList.add( "class6fav" )
      })
    } )
}

//End of loading personal watchlist

//Editing of beers
//Establish what beers are available to edit
function editbeers_prepare( input ) { //Click the link to show the beers
  var user = firebase.auth().currentUser.uid; //Get current user
  var ref = firebase.database().ref( "Users" ).child( user ).child( "un" )
  ref.once( 'value', function( snapshot ) {
    var ven = snapshot.val() //Current user
    var ref = firebase.database().ref( "Drinks" ); //Make connection to drinks table
    ref.once( 'value', function( snapshot ) { //Cycle through drinks
      snapshot.forEach( function( childSnapshot ) {
        if ( childSnapshot.child( "venue" ).val() == ven ) { //Only include drinks associated with venue
          var beer_option = document.createElement( 'option' ); //create an option
          beer_option.appendChild( document.createTextNode( childSnapshot.child( "dn" ).val() ) ); //make that option correspond to a beer
          document.getElementById( 'beers_to_edit' ).appendChild( beer_option ); //add option to select dropdown
          beer_option.value = childSnapshot.child( "did" ).val(); //add value to that option
        }
      } );
    } );
  } )
}
// Ending of establishing what beers can be edited
//Loading beer to be edited in form
function load_beer_to_edit() {
  d = document.getElementById( "beers_to_edit" ).value;
  var firebaseRef = firebase.database().ref();
  firebaseRef.child( "Drinks" ).child( d ).once( "value", drinksnapshot => {
    document.getElementById( "drink_name_edit" ).value = drinksnapshot.child( "dn" ).val();
    document.getElementById( "drink_style_edit" ).value = drinksnapshot.child( "ds" ).val();
    document.getElementById( "drink_abv_edit" ).value = drinksnapshot.child( "da" ).val();
    document.getElementById( "drink_ibu_edit" ).value = drinksnapshot.child( "di" ).val();
    document.getElementById( "drink_description_edit" ).value = drinksnapshot.child( "dd" ).val();
  } )
}
//End of loading of beer to be edited
// Update beer info
//Create Drinks
function updatedrink_submit() {
  //Drink Variables
  var drinkname = document.getElementById( "drink_name_edit" )
  var drinkstyle = document.getElementById( "drink_style_edit" )
  var drinkabv = document.getElementById( "drink_abv_edit" )
  var drinkibu = document.getElementById( "drink_ibu_edit" )
  var drinkdescription = document.getElementById( "drink_description_edit" )
  var firebaseRef = firebase.database().ref();
  var dn = drinkname.value;
  var ds = drinkstyle.value;
  var da = drinkabv.value;
  var di = drinkibu.value;
  var dd = drinkdescription.value;
  var dcd = ( new Date() ).toString();
  var did = document.getElementById( "beers_to_edit" ).value; //Get id of beer being updated
  var user = firebase.auth().currentUser.uid;
  firebase.database().ref( "Users" ).child( user ).child( "un" ).on( 'value', function( snapshot ) { //Get user role of current user (1=general user, 2=pending venue, 3=active user, 4=super user)
    venue = snapshot.val();
    firebaseRef.child( "Drinks" ).child( did ).update( {
      venue
    } ); //Send drink data to database
  } )
  firebaseRef.child( "Drinks" ).child( did ).update( {
    did,
    dn,
    ds,
    da,
    di,
    dcd,
    dd
  } ); //Send drink data to database
}
$( "#updatedrink" ).on( "click", updatedrink_submit ); /*No validation currently included*/
//End of updating beer info
// End of Loading Data
//User Upgrade Tokens
// var firebaseRef = firebase.database().ref();
// var step;
// for (let step = 0; step < 5; step++) {
// var status = 1;
// function makeid(length) {
//    var id           = '';
//    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//    var charactersLength = characters.length;
//    for ( var i = 0; i < length; i++ ) {
//       id += characters.charAt(Math.floor(Math.random() * charactersLength));
//    }
//    return id;
// }
// id = makeid(6)
// firebaseRef.child("UpgradeTokens").push({id, status}); 
// }
// Move around page
function breweries() {
  moveTo( ".main", 1 );
}

function beers() {
  moveTo( ".main", 2 );
}

function personalfavorites() {
  moveTo( ".main", 3 );
  loadpersonal();
}

function watchlistsection() {
  moveTo( ".main", 4 );
  loadwatchlist();
}

function usersettings() {
  moveTo( ".main", 5 );
}

function contactus() {
  moveTo( ".main", 6 );
}
// End of page moving

//Loading
function loading() {
  x = document.getElementById( "loading" )
  x.style.display = "block";
  setTimeout( function() {
    x.style.display = "none";
  }, 1500 ); //gif while loading
}
//End of loading