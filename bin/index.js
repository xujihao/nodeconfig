#!/usr/local/bin/node

var fs=require('fs');
var path=require('path');
var pwd=process.cwd();

var proxy='localhost:3000';

var argvs=process.argv.slice(2);

if(argvs[0]==='gulpfile' || argvs[0]==='gf'){
	for(var i=1;i<argvs.length;i++){
		if(argvs[i]==='-p'){
			proxy=argvs[i+1] || proxy;
		}
	}

	var gulpfile=["var gulp=require('gulp')","less=require('gulp-less')",
		"autoprefixer=require('gulp-autoprefixer')","plumber=require('gulp-plumber')",
		"notify=require('gulp-notify')","Browsersync=require('browser-sync').create()",
		"reload=Browsersync.reload"];

	gulpfile=gulpfile.join(',\r\n\t')+';\r\n';


	gulpfile+="gulp.task('styles',function(){\r\n"+
		"return gulp.src('./src/less/*.less')\r\n"+
		"\t.pipe(plumber()).pipe(less()).pipe(autoprefixer())\r\n"+
		"\t.pipe(gulp.dest('../public/styles')).pipe(reload({stream:true}))\r\n"+
		"\t.pipe(notify({message:'compeleted!'}));\r\n"+
	"});\r\n";


	gulpfile+="gulp.task('browser-sync',['styles'],function(){\r\n\t"+
		"Browsersync.init({\r\n\t\t"+
			"proxy:'"+proxy+"',\r\n\t\t"+
			"baseDir:'./'\r\n\t"+
		"});\r\n\t"+
		"gulp.watch('./src/less/*.less',['styles']);\r\n\t"+
		"gulp.watch('./public/**/*.*').on('change',reload);\r\n\t"+
		"gulp.watch('./views/*.*').on('change',reload);\r\n"+
	"});\r\n";

	gulpfile+="gulp.task('default',['browser-sync']);";
	fs.exists(path.join(pwd,'src'),function(exists){
		if(exists){
			fs.writeFile('src/gulpfile.js',gulpfile,function(){
				console.log('gulpfile.js write success');
			});
		}
		else{
			fs.writeFile('gulpfile.js',gulpfile,function(){
				console.log('gulpfile.js write success');
			});
		}
	});
}
else if(argvs[0]==='webpack' || argvs[0]==='wp'){
	var wpconfig="module.exports={\r\n\t"+
		"entry:'./public/js/main.js',\r\n\t"+
		"output:{\r\n\t\t"+
			"path:'./public/js',\r\n\t\t"+
			"filename:'build.js'\r\n\t"+
		"},\r\n\t"+
		"module:{\r\n\t"+
			"loaders:[\r\n\t"+
			"{\r\n\t\t"+
				"test:/\.vue$/,\r\n\t\t"+
				"loader:'vue'\r\n\t"+
			"},{\r\n\t\t"+
			"test:/\.js$/,\r\n\t\t"+
			"exclude:/node_modules/,\r\n\t\t"+
			"loader:'babel'\r\n\t"+
			"}]\r\n\t"+
		"},\r\n\t"+
		"babel:{\r\n\t\t"+
			"presets:['es2015'],\r\n\t\t"+
			"plugins:['transform-runtime']\r\n\t"+
		"}\r\n"+
	"};";

	fs.writeFile('webpack.config.js',wpconfig,function(){
		console.log('webpack.config.js write success');
	});
}
else{
	console.log("use 'nodeconfig gulpfile' or 'nodeconfig gf' to generate gulpfile.js");
	console.log("use 'nodeconfig webpack' or 'nodeconfig wp' to generate webpack.config.js");
}
