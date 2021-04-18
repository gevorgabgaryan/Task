const request = require('request');
const cheerio = require('cheerio');
const validator = require('validator');
const {LinkModel}=require('../models/LinkModel')

class IndexController{
    homeView(req,res){
        res.render('index', { title: 'Express' });
    }

   async urlScanner(req,res){
      let websiteLink=req.body.link;     
      let domainName=websiteLink.replace(/.+\/\/|www.|\..+/g, '');
      console.log("domain",domainName);
      try{
       if(validator.isURL(websiteLink)){
         let links=await linkExtractor(websiteLink, websiteLink)
         console.log("linkss",links);  
          res.json(JSON.stringify(links))
       }else{
         res.json({error:"not url"})
       }   
       
     
      }catch(err){
        console.log(err);
        res.json({error:err.message})
      }  
    }
}

async function linkExtractor(url, domain){

  try {
    request(url,async function  (error, response, body) {
      console.error('error:', error); // Print the error if one occurred
      statusCode=response && response.statusCode;
      let savedLink= await LinkModel.create({
        link:url,
        statusCode,
        domain
       })
      console.log(savedLink);
       // Print the response status code if a response was received
      if(body){
        let links=linkExtractorFromHTML(body, domain);  
        console.log('linksssssssss',links);
        links.forEach(link=>{
          linkExtractor(link,domain)
        })
        return links;  
      }     

    }); 
  
    // do something else here with these links, such as writing to a file or saving them to your database
  } catch (err) {
    console.log(err.message);
    return err.message
  }
}

function linkExtractorFromHTML(body, domain){
  //
   let linksSet=new Set();
  // Using cheerio to extract <a> tags
  const $ = cheerio.load(body);

  const linkObjects = $('a');
  // this is a mass object, not an array

  // Collect the "href" and "title" of each link and add them to an array

  linkObjects.each((index, element) => {
     let link=$(element).attr('href'); // get the href attribute 
     if(link){
     if(validator.isURL(link)){
      linksSet.add(link)
    }else{
      if(link){
        let changeLink=domain+link.slice(link.indexOf('/')+1);
        console.log("changeLink",changeLink);
        if(validator.isURL(changeLink)){
          linksSet.add(changeLink)
        }else{
          console.log("brokenlink",changeLink);
        }
      }
     }
    }
  });
  console.log(`linksSet`,linksSet.size);
   return [...linksSet]
}



module.exports=new IndexController();