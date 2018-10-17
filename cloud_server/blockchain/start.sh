# need start up bootnode in advance
if [ ! -f bootnode.log ];then
    echo "please run bootnode.sh first"
    exit
fi

ip=$(ifconfig|grep inet|grep -v inet6|grep Bcast|awk '{print $2}')
ip=${ip:5}

bootnode_addr=enode://"$(grep enode bootnode.log|tail -n 1|awk -F '://' '{print $2}'|awk -F '@' '{print $1}')""@$ip:30301"
if [ "$1" == "" ];then
    echo "node id is empty, please use: start.sh <node_id>";
    exit
fi
no=$1
datadir=./
mkdir -p $datadir

if [ ! -d "$DIRECTORY" ]; then
    if [ ! -f $datadir/genesis ];then
        echo '{"config": {"chainId": 15, "homesteadBlock": 0, "eip155Block": 0, "eip158Block": 0 }, "coinbase" : "0x0000000000000000000000000000000000000000", "difficulty" : "0x1", "extraData" : "0x", "gasLimit" : "0xffffffff", "nonce" : "0x0000000000000042", "mixhash" : "0x0000000000000000000000000000000000000000000000000000000000000000", "parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000", "timestamp" : "0x00", "alloc": { } }' > $datadir/genesis
    fi
    /home/ubuntu/eth/go-ethereum/build/bin/geth --datadir $datadir/$no init $datadir/genesis
fi

/home/ubuntu/eth/go-ethereum/build/bin/geth --preload /home/ubuntu/test/autominer.js --datadir $datadir/$no --networkid 11100 --ipcdisable --port 619$no --rpc --rpcapi "db,eth,net,web3,txpool,personal" --rpcaddr $ip --rpccorsdomain "*" --rpcport 81$no --bootnodes $bootnode_addr console
