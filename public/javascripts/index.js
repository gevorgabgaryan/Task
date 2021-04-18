let urlInput=document.querySelector(`#urlInput`);
let sendBtn=document.querySelector(`#sendBtn`)

sendBtn.addEventListener(`click`,()=>{
    let linkObj={
        link:urlInput.value
    }
    console.log(linkObj);
    fetch("/extract",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(linkObj)
    }).then(res=>res.json())
     .then(data=>{
         console.log(data);
     })
})