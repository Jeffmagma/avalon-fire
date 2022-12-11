# avalon-fire

### alpha 0.2.2

realtime avalon with rooms, using firebase and react (hosted [here](cyan-pink.web.app), 5 or more people required to play)

## TODO

-   [ ] replace ant design with mui/nextui/maybe something else? to use some ui stuff that might look nicer, some bugs with antd
    -   [ ] first, actually gotta decide what goes where
    -   [x] implement some responsive grid stuff
    -   [ ] dark mode (stopped working in antd at 5.0 update, used to be just a css file now it's some kind of algorithm that doesn't work, gotta set colors manually?)
    -   [ ] does anyone know why it seems like in every ui library it's super easy to get a tag with a custom color, but changing the color of text or buttons seems unnecessarily hard? why don't they just have the same color property?
-   [x] implement actual game logic
    -   [x] keep track of votes, turn, fails, etc
    -   [x] keep track of quest leaders, and only count votes after everyone has voted
    -   [x] know when someone has won
-   [x] restructure file system
-   [ ] possible google/facebook login when public
-   [ ] simpler (custom?) room IDs, or hide room id altogether and let users find rooms based on usernames
-   [x] refactor to automatically deconstruct props, look into moving some state around
-   [ ] timeline? what do i put on the timeline
-   [ ] tooltips when a button is disabled
-   [ ] restructure votes object so that the mission is on the outside, assuming collapsible is the right structure
-   [ ] move role select to in the lobby? is that objectively better
-   [ ] targeting, plot cards, lady of the lake

## v2??

-   [ ] typescript
-   [ ] routes for each state, instead of a single page app (next.js or vite ssr plugin possibly?)
    -   [ ] svelte looks very interesting but i don't understand `object = object` for deep reactivity? probably stick with react just cause i know it
-   [ ] custom component library or use radix + lot of custom css
-   [ ] supabase realtime (learn postgres basics first)
    -   [ ] why is it that when i search "supabase hosting" all i get is self hosting?? i just want to know if supabase has website hosting like firebase does..
