DATA1=$(redis-cli keys \* | tr "\n\r" " ")
redis-cli del $DATA1
DATA2=$(redis-cli keys \*)
if [$DATA2 == ""]; then
    echo "$DATA1 clear"
else
    echo "delete error"
fi
# cd /home/pi/opcom_prj/gotest15_opf408L10
node buildkeytable.js
