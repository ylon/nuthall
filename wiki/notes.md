### nuthall cli
```
nuthall searchSerie --source yggtorrent --string 'game of' --format object|json --file 'result'

nuthall searchSerie --source yggtorrent --string 'game of' --format object|json --file 'result'
```

### npm depencies from a github branch
"torrent-search-api": "git+https://github.com/ylon/torrent-search-api.git#nuthall",

### kokonut.org install
```
cd /home/node_modules

git clone https://github.com/ylon/nuthall.git
cd nuthall
npm i

git clone https://github.com/ylon/torrent-search-api
cd torrent-search-api
git checkout --track origin/nuthall
npm i
```

### git merge from upstream
```
git clone git@github.com:ylon/torrent-search-api.git ylon.torrent-search-api
cd ylon.torrent-search-api
git remote add upstream https://github.com/JimmyLaurent/torrent-search-api
git remote -v
git fetch upstream
git checkout master
git merge upstream/master
```

### TODO torrent-search-api
```
# torrent-search-api
	# [PENDING] cloudscraper
	~ resultsPerPageCount 25 -> 50
	fs-extra

# nuthall
	# download : mkdir tgtfile path
	# ~ package.json : torrent-search-api REPO|VERSION
```

### trackers
```
xthor
casatorrent
elitetracker
```
