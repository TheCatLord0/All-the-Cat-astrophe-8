const isDedicatedServer = event => {
  return event.server.isDedicatedServer()

// Server Banned items
let serverBanned = [

]
let serverDisabled = [

]
let chunkLoader = [
    'create_power_loader:empty_andesite_chunk_loader',
    'create_power_loader:andesite_chunk_loader',
    'create_power_loader:empty_brass_chunk_loader',
    'create_power_loader:brass_chunk_loader',
    'mekanism:upgrade_anchor',
    'mekanism:dimensional_stabilizer',
    'ae2:spatial_anchor'
]

PlayerEvents.inventoryChanged(event => {
if (!isDedicatedServer(event)) return
  let player = event.player;
  let inventory = player.inventory.items; // NeoForge inventory access

  if (!serverBanned.includes(event.item.id)) return;

  // Alert the player
  player.tell([
    Text.darkRed("[Alert] ").bold(), 
    Text.gold(event.item.id).bold(), 
    Text.gray(" has been deleted."),
    "\n",
    Text.green("If you have questions why, ask server owner.")
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
if (!isDedicatedServer(event)) return
  serverBanned.forEach(serverBanned => {
    event.addTableModifier(/.*/).removeLoot(serverBanned)
  })
  serverDisabled.forEach(serverDisabled => {
    event.addTableModifier(/.*/).removeLoot(serverDisabled)
  })
  chunkLoader.forEach(chunkLoader => {
    event.addTableModifier(/.*/).removeLoot(chunkLoader)
  })
})
ServerEvents.recipes(event => {
if (!isDedicatedServer(event)) return
  serverBanned.forEach(serverBanned => {
    event.remove({output: serverBanned })
  })
  serverDisabled.forEach(serverDisabled => {
    event.remove({output: serverDisabled })
  })
  chunkLoader.forEach(chunkLoader => {
    event.remove({output: chunkLoader })
  })
  event.shapeless('loadmychunks:chunk_loader', '#cat:chunkloader')
})
ServerEvents.tags('item', event => {
if (!isDedicatedServer(event)) return
  serverBanned.forEach(serverBanned => {
    event.add('cat:server_banned', serverBanned)
  })
  serverDisabled.forEach(serverDisabled => {
    event.add('cat:server_disabled', serverDisabled)
  })
  chunkLoader.forEach(chunkLoader => {
    event.add('cat:chunkloader', chunkLoader)
  })
})
}