# Crypto Questions


lay out the basic working of crypto
what is a node? and is node and validator same?
how many full nodes are there and what are their address?
so its not like some entity is responsible for providing these full nodes? is it possible all full nodes go down?
so is it possible that all but one node goes down and that one node can manipulate new transactions and now there is no consensus, later transactions are manipulated
what is consensus rule and mechanism
I made a transaction but it was discarded later because of some other valid chain, when do I consider funds transferred entirely and will not be reversed later
in bitcoin, if transactions in orphaned chains are mined again, then is a txn not final once it enters the network?
be dropped, replaced, or even conflicted // explain these scenarios
What is utxo
so this is what double spending prevention means, after a utxo is spent it cannot be spent again?
how do we know if a utxo is spent or not?
but isn't the db local to node, what if in one node UTXO is spent but in other it is unspent
how does a node knows about spent unspent UTXOs, basically does it know all the utxos, because sometime before you said a node doesn't stores all utxos ever
what does a transaction and a block consists of
what is coinbase that you are referring to
if spent utxos are removed I am guessing node has no record of it, so when node adopts a longer chain, how node knows which utxos to make unspent and it back to set
how many nodes need to verify the block for the block to be accepted
what if a node gets a skip block, say it has till 100, but instead of getting 101, got 102, what does it do then? wait for 101?
if nodes keep receiving block only, how does it knows a longer chain exists and switches to it
What if I get 98, when I am on 101
but lets say that 98 is part of a chain longer than 101, say 110, but this node doesn't have 99 to 110 blocks so it will discard 98
how many transaction in general a block contains
at the peak in 2021-2022, was it any different?
how much of all this is abstracted?
for an end user, to buy sell crypto, what are abstraction levels, and what is end user required to do at each level
can I not run a small node? just to make transactions and see check balance?
I can give max 50GB space, 2 gb ram space on macbook air, and not being connected all the time, and I don't want to verify all blocks, just get the longest chain ig, and broadcast transations and receive confirmation and check balance
all this network interaction uses which network protocols, do they use https tcp/ip?
Who manages mempools, where is it hosted


What is satoshi
Network protocol these nodes follow
If BC only contains who gave who how much, how does the origin works, like initially how much who had, what is initial, how can I get initial
Mining reward, how is that given, is that another transaction on network
Don’t I need other person’s private key to transfer coins to me, so how can I manipulate even if mine is only one node that survives
who provides bitcoin core software, can I alter it
How 21 million cap