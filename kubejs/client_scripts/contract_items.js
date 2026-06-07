(function () {
  const KEY_ID = 'martyr_core_blast'
  const CHANNEL = 'martyr_core_blast'

  KeyBindEvents.pressed(KEY_ID, event => {
    const player = event.player || Client.player
    player.sendData(CHANNEL, {})
  })

ClientEvents.lang('en_us', event => {
  event.add('key.kubejs.martyr_core_blast', 'Detonate Martyr Core')
  event.add('key.categories.kubejs.contract_items', 'Contract Items')
})
})()