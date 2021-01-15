//create a file structure
const fs = require('fs')
//create a CSV parser
const csv = require('csv-parser')



//create array or list to save the column data from csv file
var name=[];
var volunteerName=[];
var volunteerId=[];
var date=[];
var shift=[];
var shiftReason=[];
//create a list to save the vertix
var nodes=[];

var print_node1=[];
var print_node2=[];
var Table_2=[];


//create readstream to read the csv file
fs.createReadStream('volunteer_attendance_data.csv')
  .pipe(csv())
  .on('data', function (row){
    
      date.push(row.date)
      shift.push(row.shift)
      volunteerId.push(row.volunteerId)
      volunteerName.push(row.volunteerName)
      shiftReason.push(row.shiftReason)
    })
    .on('end', function () {

      //create a object of Graph Class
        var g= new Graph();
        var Date='0';
        var Time='0';
        //find the vertex from volunter name
        for(var i=0;i<volunteerName.length;i++){
          g.addVertex(volunteerName[i]);
        }
        
        //find the edge for verteces

        for(var k=0;k<nodes.length;k++){
          for(var j=0;j<volunteerName.length;j++){
            if(nodes[k]==volunteerName[j]&& Date!=date[j] && Time!=shift[j]){
              Date=date[j];
              Time=shift[j];
            }
            
            else if(nodes[k]!=volunteerName[j]&& Date==date[j] && Time==shift[j]){
              g.addEdge(nodes[k],volunteerName[j]);
            }
          }
          Date='0'
          Time='0'
        }
        
        //print the graph
         console.log("Print The Graph ");
         g.print();
         
         //print the graph with nodes in tabular format
         Table_2={
           Node1:print_node1,
           Node2:print_node2
         };

         console.log("Print the nodes");
         console.table(Table_2);
         
         //Write the csv file
         writeToCSVFile(print_node1,print_node2);
       })
      
      //Graph class to constract a network graph among the voulenters
      class Graph {
        
        constructor() {
          this.AdjList = new Map();
          
        }
        
        addVertex(vertex) {
          if (!this.AdjList.has(vertex)) {
            this.AdjList.set(vertex, []);
            nodes.push(vertex);
          } else {
          
          }
        }
        
        addEdge(vertex, node) {
          if (this.AdjList.has(vertex)) {
            if (this.AdjList.has(node)){
              let arr = this.AdjList.get(vertex);
              if(!arr.includes(node)){
                arr.push(node);
                //find the vartix and their nodes to print and for save as CSV 
                print_node1.push(vertex);
                print_node2.push(node);
              }
            }else {
              throw `Can't add non-existing vertex ->'${node}'`;
            }
          } else {
            throw `You should add '${vertex}' first`;
          }
        }

        print() {
          for (let [key,value] of this.AdjList) {
            console.log(key,value);
          }
        }

          
      }

// create a fuction for write a CSV file
      function writeToCSVFile(n1,n2) {
        const filename = 'output.csv';
      
        fs.writeFile(filename, extractAsCSV(n1,n2), err => {
          if (err) {
            console.log('Error writing to csv file', err);
          } else {
            console.log(`saved as ${filename}`);
          }
        });
      }
      
      function extractAsCSV(n1,n2) {
        const header = ['Node1,Node2'];
        first_node=[];
        secode_node=[]
        for(var n=0;n<n1.length;n++){
          first_node.push(n1[n])
          secode_node.push(n2[n])
        }
        var rows=[first_node,secode_node]
        return header.concat(rows).join('\n');
      }
