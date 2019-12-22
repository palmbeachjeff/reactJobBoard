var fetch = require('node-fetch'); 
var redis = require("redis"),
  client = redis.createClient();

const { promisify } = require('util');
const setAsync = promisify(client.set).bind(client);


baseURL = 'https://jobs.github.com/positions.json'; 

async function fetchGithub() {

  console.log("fetching junior dev jobs from github.com");

  let resultCount = 1, onPage = 0;
  const allJobs = [];  
  
  //fetch all pages
  while(resultCount > 0){
    const res = await fetch(`${baseURL}?page=${onPage}`);
    const jobs = await res.json();
    allJobs.push(...jobs); 
    resultCount = jobs.length; 
    console.log('got' , jobs.length, 'jobs');
    onPage++; 
  }

  console.log('got', allJobs.length, 'jobs total'); 

  // filter algorithm 
  const jrJobs = allJobs.filter(job=> {
    const jobTitle = job.title.toLowerCase(); 
    let isJunior = true; 

    //logic
    if (jobTitle.includes('senior') || jobTitle.includes('manager') || 
        jobTitle.includes('sr.') || jobTitle.includes('architect')) {
          
          isJunior = false
    }

    return isJunior; 
  })
   
  console.log('filtered down to ', jrJobs.length); 

  //set in redis 
  const success = await setAsync('github', JSON.stringify(jrJobs)); 

  console.log({success}); 
}

module.exports = fetchGithub; 