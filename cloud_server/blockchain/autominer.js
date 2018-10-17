var mine = false;
function autominer () {
        if(txpool.status.pending && !mine){
            mine = true;
            web3.miner.start();
        }
        if(!txpool.status.pending && mine){
            mine = false;
            web3.miner.stop();
        }
}

setInterval(autominer, 1000);
