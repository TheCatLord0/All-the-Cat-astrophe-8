(function () {
  const KEY_ID = 'aeternitas_conversion'
  const CHANNEL = 'aeternitas_conversion'

  KeyBindEvents.pressed(KEY_ID, event => {
    const player = event.player || Client.player
    if (!player) return

    player.sendData(CHANNEL, {})
  })

  ClientEvents.lang('en_us', event => {
    event.add('key.kubejs.aeternitas_conversion', 'Toggle Aeternitas Conversion')
    event.add('key.categories.kubejs.thecatlord', 'TheCatLord')
  })
})()
