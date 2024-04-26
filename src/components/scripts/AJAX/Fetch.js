import { paginate } from '../pagination';

function fget(uri, store, limit, currentpage, back, ajax){
  fetch(uri)
  .then((response)=> {
    store.snippet += `------ GET ---- ${Date.now() - store.time} ms--------\nfetch.get(${uri})\n.then((response)=>{return response.json()}).then((response)=>{const data = response})\n\n`;
    if(response.ok){ return response.json() } else {throw new Error("[!response.ok]")} 
  })
  .then((response)=>{
    store.rows = response.rows;
    store.pagination = paginate(response.total, currentpage, limit, 10);//(number of filtered rows, current page, per page, max pages)
  })
}

function fpost(uri, body, store, limit, back, ajax){
  fetch(uri, {method:"POST", body:body})
  .then((response)=> {
    store.snippet += `------ POST -- ${back}:${ajax} -- [${Date.now() - store.time} ms] -------- ${store.time.getDate()}/${store.time.getMonth()+1}/${store.time.getFullYear()} ${store.time.getHours()}:${store.time.getMinutes()}:${store.time.getSeconds()}
    fetch(${uri}, {"method":'POST', "body":data})\n.then((response)=>{return response.json()}).then((response)=>{const data = response})\n\n`;
    return response.json()
  })
  .then((response)=>{
    const rowToInsert = {"id":response.newId, "_id":response.newId, "photo":response.photo, "name":body.get("name"), "age":body.get("age")};//FormData object use get 
    store.rows.unshift(rowToInsert);
    if(store.rows.length>limit){store.rows.pop();} //remove last row in <table> (respect _limit after add)
  })
}

function fput(method, uri, body, selectedTr, store, back, ajax){
  fetch(uri, {
    method: method,
    body: body
  })
  .then((response)=> {return response.json()})
  .then((response)=> {
    store.rows[selectedTr].name=body.get('name'); store.rows[selectedTr].age=body.get('age');store.rows[selectedTr].photo=response.photo;
  })
}

function fdelete(method, uri, store, back, ajax){
  fetch(uri, {method: method})
  .then((response)=>{return response.json()})
  .then((response)=>{
    //GET replacement row
    if(response.length>0)
    { store.rows.push({"id":response[0].id, "_id":response[0]._id, "name":response[0].name, "age":response[0].age, "photo":response[0].photo}) }
  })
}

function fixHeader(){
  // const defaultHeaders = new Headers(); //create an object to work with in all calls
  // defaultHeaders.append('Content-Type', 'application/json; charset=utf-8');
  ////setting "Content-Type" to "multipart/form-data" throws "Multipart: Boundary not found" error

  //body: JSON.stringify(body), headers: {"Content-Type":"application/json"} //if data send as JSON not as FormData (no photos)
}

export default {fget, fpost, fput, fdelete}