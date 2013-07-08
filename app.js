
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
   res.render("index", {
     title: "Home"
 });
});

app.get('/calendar', function(req, res){
  var courses=[{name: "Medientechnologie",
                short: "MT",
                semesters: [2,4,6]},
                {name: "Wirtschaftswissenschaften",
                short: "WIW",
                semesters: [2,4]},
                {name: "Elektrotechnik",
                short: "EIT",
                semesters: [2,4,6]}];
  
  var semester=req.query.semester;
  var courseName=req.query.course;
  
  console.log(courseName, semester)
  
  function match(el){
   return el.short.toLowerCase()==courseName.toLowerCase();
  }
  
  // Display Calendar  
  if(semester){
    var course=courses.filter(match)[0];
    
    var week=[{day: "Montag",
               events:[{
                 name: "Mathematik 2",
                 location: "H118",
                 time: "8:00",
                 lecturer: "Prof. Dr. Böhme"}]
              },
              {day: "Dienstag",
               events:[
                {name: "Mathematik 2",
                 location: "H118",
                 time: "12:00",
                 lecturer: "Prof. Dr. Böhme"},
                {name: "Mathematik 2",
                 location: "H118",
                 time: "12:00",
                 lecturer: "Prof. Dr. Böhme"},
                {name: "Mathematik 2",
                 location: "H118",
                 time: "12:00",
                 lecturer: "Prof. Dr. Böhme"}]
              },
              {day: "Mittwoch",
               events:[{
                 name: "Mathematik 2",
                 location: "H118",
                 time: "10:00",
                 lecturer: "Prof. Dr. Böhme"}]
              }]
    
    // check if selection is valid
    if(course && course.semesters.indexOf(Number(semester))!=-1){
      res.render("calendar", {
        title: "Calendar "+courseName+" "+semester,
        week: week
      });
    }else{
      res.redirect("/calendar");
    }
    
  // Select Semester  
  }else if(req.query.course){
    var course=courses.filter(match)[0];
    
    // check if selection is valid
    if(course){
      res.render("selectSemester", {
        title: "Choose semester",
        course: course
      });
    }else{
      res.redirect("/calendar");  
    }
    
  // Select Course
  }else{
    res.render("selectCourse", {
      title: "Choose course",
      courses: courses
    });   
  } 
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
