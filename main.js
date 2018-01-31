var cluster = require('cluster');
cluster.schedulingPolicy = cluster.SCHED_RR;

if(cluster.isMaster){
    const NUM_OF_CORES = require('os').cpus().length;
    console.log('Exam Project - node.js cluster exam');
    console.log('This Computer has ' + NUM_OF_CORES + ' cpu cores.');
    console.log('Master');

    for(var i = 0; i < NUM_OF_CORES; i++){
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' started.');
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log('pid of died Worker : ' + worker.process.pid);
        console.log('exit code of died Worker : ' + code);
        console.log('signal of died Worker : ' + signal);
    })
}else{

}