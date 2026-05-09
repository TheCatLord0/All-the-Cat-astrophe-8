Platform.mods.kubejs.name = 'TheCatLord'
StartupEvents.registry('creative_mode_tab', event => {
	event.create('plushies').icon(() => 'kubejs:odins_plush').displayName(('Plushies')).content(showRestrictedItems => [
    'kubejs:odins_plush'
  ])
})
StartupEvents.modifyCreativeTab('kubejs:tab', event => {
	event.remove('kubejs:odins_plush')
})
StartupEvents.registry('block', event => {
  event.create('odins_plush','cardinal')
    .displayName('Odinshi Plushie')
    .item(item => {
      item.unstackable()
      item.fireResistant(true)
      item.rarity('EPIC')
    })
    .parentModel('thecatlord:block/plushies/odins_plush')
    .opaque(false)
    .fullBlock(false)
    .renderType('cutout')
    .hardness(0.5)
    .soundType('wool')
    .box(1.5, 0, 3, 14.5, 16, 12)
})
