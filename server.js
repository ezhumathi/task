//importing express
const express =require('express');
//creating a server
const server=express();
//creating a port number
const port=5000;
const items=[{id:1,name:'jeans'},
    {id:2,name:'skirts'},
    {id:3,name:'kurthis'}
];
//middleware
server.use(express.json());
server.get('/',(req,res)=>
    {res.end("ezhumathi's server is running");

    }
);
server.get('/product',(req,res)=>{
    res.json(items);
})

server.post('/product',(req,res)=>{
    newitem={id:items.length+1,name:req.body.name};
    items.push(newitem);
    res.status(201).json(newitem);
});
server.put('/product/:id',(req,res)=>{
    const itemid=parseInt(req.params.id);
    const updateditem=items.findIndex((item)=>item.id===itemid)
    if(updateditem !==-1)
    {
        items[updateditem].name=req.body.name;
        res.json(items[updateditem]);
    }
    else{
        res.status(404).json("item not found in data base")
    }
})
server.listen(port,()=>{
    console.log("server is running on http://localhost:${port}")
});