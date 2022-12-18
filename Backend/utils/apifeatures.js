class ApiFeatures {
    constructor(query, querystr) {
        this.query = query;
        this.querystr = querystr;
  }

  //search api to search matching substrings
  search() {
    const keyword = this.querystr.keyword ? { //search keyword here
      name: {
        $regex: this.querystr.keyword, // forming regex of he value
        $options: "i",
      },
    } : {};
      this.query = this.query.find({ ...keyword }); // calling product.Find() over the keyword
      return this;
  }

  // Filter API call
    filter() {
        const querycopy = { ...this.querystr }; // ... gives a copy to querystr object not real one
        
        // remove fields for category 
        const removeFeilds = ["keyword", "page", "limit"];
      removeFeilds.forEach((key) => delete querycopy[key]); // removes queries not required to work upon
      // Filter for Price and Rating
      
      let querystr = JSON.stringify(querycopy); // convert object to string to add $ sign as mongo db operator have it in front
      // lt gt gte lte are inbuilt in mongo db
      querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${ key }`); //using regex to add $

      this.query = this.query.find(JSON.parse(querystr)); //returning converting string to object
      
      return this;
    }
};

module.exports = ApiFeatures;