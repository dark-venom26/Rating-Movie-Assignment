const router = require("express").Router();
const fetchuser = require("../middleware/fetchuser");
const {body, validationResult} = require("express-validator");
const User = require("../models/User");

// Get all movies of an user
router.get("/:id", async (req, res)=>{
    try{
        const allmovie = await User.findById(req.params.id);
        res.status(200).json({"data" : allmovie.movies});
    }catch(err){
        res.status(500).json(err);
    }
})

// Create a new movie rating
router.post("/", fetchuser, [
    body("name", "Minimum length of username must be atleast 3 characters long").isLength({min: 3}),
    body("rating","Rating limit is 1 to 5").isInt({ min: 1, max: 5 })
], async (req, res)=>{
    const errors = validationResult(req);
    let success = false;
    if(!errors.isEmpty()){
        return res.status(400).json({success, errors: errors.array()})
    }

    const {name, rating} = req.body;
    try {
        const user = await User.findById(req.user.id)
        await user.updateOne({$push: {"movies":{name, rating}}})
        res.status(200).json({"data":"Movie rated successfully"});
    }catch(err){
        res.status(500).json(err);
    }
})


// Update a movie rating
router.put("/:id", fetchuser, [
    body("name", "Minimum length of username must be atleast 3 characters long").isLength({min: 3}),
    body("rating","Rating limit is 1 to 5").isInt({ min: 1, max: 5 })
], async (req, res)=>{
    let movieId = Object(req.params.id.trim())
    const {name, rating} = req.body

    try{
        const user = await User.findById(req.user.id);
        if(user._id.toString() === req.user.id){
            await User.updateOne({"movies._id": movieId},{$set : {
                "movies.$.name": name,
                "movies.$.rating": rating,
                "movies.$.updatedAt": new Date() 
            }})
            res.status(200).json({"success" : "Movie rating has been updated successfully"});
        }else{
            res.status(403).json({"error" : "You can update only your movie ratings"});
        }
    }catch(err){
        res.status(500).json(err);
    }
})


// Get Search Movie Ratings
router.get("/search/:name", async (req, res)=>{
    try{
        const result = await User.find({"movies.name": {$regex:req.params.name}})
        var moviesList = []

        await Promise.all(
            result.map(async(user)=>{
                user.movies.map((movie)=>{
                    if(movie.name.includes(req.params.name)){
                        moviesList.push(movie)
                    }
                })
            })
        )


        // let uniqueMovies = [
        //     ...new Map(moviesList.map((movie)=>[movie["name"], movie])).values(),
        // ]

        res.status(200).json({"data": moviesList});
    }catch(err){
        res.status(500).json(err);
    }
})



module.exports = router;