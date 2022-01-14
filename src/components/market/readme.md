# now double click to chanage state

## following is for Market

### to detect changing
store.state.FishMongerDisplay[0]["id"]
store.state.FishMongerDisplay[0]["display"]
### to change state 
store.commit("FishMongerChangeState",{id:'1',display:'false'}

## following is for MarketTable

### to detect changing
store.state.FoodDisplay[0]["id"], store.state.FoodDisplay[0]["display"]
### to change state 
store.commit("FoodChangeState",{id:'1',display:'false'}
