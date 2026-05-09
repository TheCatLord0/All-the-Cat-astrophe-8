// Banned items
let bannedItems = [
   'easy_villagers:auto_trader',
   'easy_villagers:iron_farm' 
]

PlayerEvents.inventoryChanged(event => {
  let player = event.player;
  let inventory = player.inventory.items; // NeoForge inventory access

  if (!bannedItems.includes(event.item.id)) return;

  // Alert the player
  player.tell([
    Text.darkRed("[Alert] ").bold(), 
    Text.gold(event.item.id).bold(), 
    Text.gray(" has been deleted."),
    "\n",
    Text.green("If you have questions why, ask thecatlord0 on Discord.")
  ])

  // Remove all instances of the banned item
  for (let i = 0; i < inventory.length; i++) {
    let slotItem = inventory[i];
    if (slotItem && slotItem.id === event.item.id) {
      slotItem.count = 0 // Clears the stack
    }
  }
})
LootJS.modifiers(event => {
  bannedItems.forEach(bannedItems => {
    event.addTableModifier(/.*/).removeLoot(bannedItems)
  })
})
ServerEvents.recipes(event => {
  bannedItems.forEach(bannedItems => {
    event.remove({output: bannedItems })
  })
})
ServerEvents.tags('item', event => {
  bannedItems.forEach(bannedItems => {
    event.add('cat:removal', bannedItems)
  })
})
// Replacement recipes
ServerEvents.recipes(event => {
event.replaceInput(
  { output: 'industrialforegoing:mob_duplicator' },
  ['minecraft:nether_wart', 'minecraft:magma_cream'],
  'mekanism:pellet_antimatter')
event.replaceInput(
  { output: 'simulated:red_portable_engine' },
  ['minecraft:blast_furnace'],
  'create:blaze_burner')
})
