const got = require('got');
const fs = require('fs');
const validator = require('validator');
const urlStatusCode = require('url-status-code')
const cheerio = require('cheerio');
const { LinkModel } = require('../models/LinkModel');
const { SaveResult } = require('asposewordscloud');

class IndexController{
    homeView(req,res){
        res.render('index', { title: 'Express' });
    }

   async urlScanner(req,res){
      let websiteLink=req.body.link;     
      let domainName=websiteLink.replace(/.+\/\/|www.|\..+/g, '');
      console.log("domain",domainName);
      try{  
        res.json(await linkExtractor(websiteLink, domainName))
     
      }catch(err){
        console.log(err);
        res.json({error:err.message})
      }  
    }
}

async function linkExtractor(url){
  let linkSet=new Set();
  try {
    // Fetching HTML
    const response = await got(url);  
    const html = response.body;
    // Using cheerio to extract <a> tags
    const $ = cheerio.load(html);
    const linkObjects = $('a');
    // Collect the "href" and "title" of each link and add them to an array

      linkObjects.each(async (index, element) => {
      let link=$(element).attr('href');
      console.log(index+":"+link);
      if(validator.isURL(link, { allow_protocol_relative_urls: true })){
        linkSet.add(link)
        linkExtractor(link)  
      }    
     });   
     console.log("linkSet",linkSet);
     return linkSet

  
    // do something else here with these links, such as writing to a file or saving them to your database
  } catch (err) {
    console.log(err.message);
    return err.message
  }
}

async function linkStatusCodeChecker(url){
    try {
      const status = await urlStatusCode(url)
     console.log("status",status);
      return status;
    } catch (err) {
      console.log(err);
      return err.message
    } 
}
module.exports=new IndexController();