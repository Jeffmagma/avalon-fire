# avalon-fire

### alpha 0.1.3

realtime avalon with rooms, using firebase and react (hosted [here](cyan-pink.web.app), 5 or more people required to play)

## TODO

-   [ ] replace ant design with mui/nextui/maybe something else? to use some ui stuff that might look nicer, some bugs with antd
-   [x] implement actual game logic
    -   [x] keep track of votes, turn, fails, etc
    -   [x] know when someone has won
-   [x] restructure file system
-   [ ] possible google/facebook login when public
-   [ ] simpler (custom?) room IDs
-   [ ] refactor to automatically deconstruct props, look into moving some state around
-   [ ] timeline? what do i put on the timeline
-   [ ] tooltips when a button is disabled
-   [ ] restructure votes object so that the mission is on the outside, assuming collapsible is the right structure

## v2??

-   [ ] typescript
-   [ ] routes for each state, instead of a single page app (next.js possibly?)
    -   [ ] svelte looks very interesting but i don't understand `object = object` for deep reactivity? probably stick with react
-   [ ] custom component library or use primitive + lot of custom css
-   [ ] supabase realtime (learn postgres basics first)
