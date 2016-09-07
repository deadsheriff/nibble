module.exports = function(app) {
    //Function for checking the file type..
   app.dataSources.storage.connector.getFilename = function(file, req, res) {
        var pattern = /^image\/.+$/;
        var value = pattern.test(file.type);
        if(value ){
            var fileExtension = file.name.split('.').pop();
            var container = file.container;
            var time = new Date().getTime();
            var NewFileName = 'User'  + '_' + time+'' +Math.round((Math.random()*100)) + '_'  + '.' + fileExtension; 
            return NewFileName;
        }
        else{
            throw "FileTypeError: Only File of Image type is accepted.";
        }
    };
}