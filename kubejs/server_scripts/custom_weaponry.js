
ServerEvents.recipes(event => {
event.smithing(
 Item.of('kubejs:ego_mimicry[minecraft:unbreakable={show_in_tooltip:false}]'),
  'minecraft:netherite_upgrade_smithing_template',
  'kubejs:mimicry',
  '#thecatlord:dragonsteel'
)
})
// Funny One Shot
EntityEvents.afterHurt(event => {
    const { entity, source } = event
    let attackingEntity = source.actual
    if (!attackingEntity) return
    if (attackingEntity.mainHandItem.id != 'kubejs:executioner') return
    entity.kill()
})
EntityEvents.afterHurt(event => {
    if (event.source.player) {
        let player = event.source.player
        let weapon = player.getMainHandItem()
        if (weapon.id === 'kubejs:mimicry') {
            let damageDealt = event.damage
            let healAmount = damageDealt * 0.25
            player.heal(healAmount)
        }
    }
})
EntityEvents.afterHurt(event => {
    if (event.source.player) {
        let player = event.source.player
        let weapon = player.getMainHandItem()
        if (weapon.id === 'kubejs:ego_mimicry') {
            let damageDealt = event.damage
            let healAmount = damageDealt * 0.25
            player.heal(healAmount)
        }
    }
})