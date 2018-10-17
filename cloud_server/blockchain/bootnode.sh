#如果没有bootnode.key文件，先生成一个
if [ ! -f bootnode.key ];then
    /home/ubuntu/eth/go-ethereum/build/bin/bootnode -genkey bootnode.key
fi
pkill bootnode
## 后台启动bootnode，将输出重定向至bootnode.log文件
nohup /home/ubuntu/eth/go-ethereum/build/bin/bootnode -nodekey=bootnode.key > bootnode.log&
