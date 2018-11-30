module.exports = function(mongoose){
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {

        let positionSchema = new mongoose.Schema({
            x: Number,
            y: Number
        })

        let veloSchema = new mongoose.Schema({
            name: String,
            address: String,
            position: positionSchema,
            stands: Number,
            bikes: Number
        })

        let Velo = mongoose.model('Velo', veloSchema);
        let Position = mongoose.model('Position', positionSchema);
    });
}