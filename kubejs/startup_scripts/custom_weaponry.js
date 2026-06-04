Platform.mods.kubejs.name = 'TheCatLord'
StartupEvents.registry('creative_mode_tab', event => {
	event.create('weaponry').icon(() => 'kubejs:mimicry').displayName(('Weaponry')).content(showRestrictedItems => [
            'kubejs:executioner',
            'kubejs:mimicry',
            'kubejs:ego_mimicry',
            'kubejs:tibia',
            'kubejs:callisto_tibia'
  ])
})
StartupEvents.modifyCreativeTab('kubejs:tab', event => {
	event.remove('kubejs:executioner')
  event.remove('kubejs:mimicry')
  event.remove('kubejs:ego_mimicry')
  event.remove('kubejs:tibia')
  event.remove('kubejs:callisto_tibia')
})
StartupEvents.modifyCreativeTab('kubejs:weaponry', event => {
    // Remove the plain default stacks that .content() added
    event.remove('kubejs:executioner')
    event.remove('kubejs:mimicry')
    event.remove('kubejs:ego_mimicry')
    event.remove('kubejs:tibia')
    event.remove('kubejs:callisto_tibia')

    // Add the exact component stacks
    event.add([
        Item.of('kubejs:executioner[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]'),
        Item.of('kubejs:mimicry[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]'),
        Item.of('kubejs:ego_mimicry[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]'),
        Item.of('kubejs:tibia[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]'),
        Item.of('kubejs:callisto_tibia[unbreakable={show_in_tooltip:false},enchantment_glint_override=false]')
    ])
})
StartupEvents.registry('item', event => {
  event.create('mimicry', 'sword')
    .displayName('§8§l§kAAA §r§4Mimicry §8§l§kAAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip("§4§lThe yearning to imitate the human form is sloppily reflected on the E.G.O, as if it were a reminder that it should remain a mere desire.")
    .tooltip("§4§lWhen the unfamiliar and otherworldly eyes stare at you, you will feel a chill up your spine.")
    .tooltip('Heals you for 25% of your damage while this is in your hand.')
    .parentModel('thecatlord:item/mimicry')
    .texture('thecatlord:item/mimicry')
    .speed(9)
    .attackDamageBonus(4)
})
StartupEvents.registry('item', event => {
  event.create('ego_mimicry', 'sword')
    .displayName('§8§l§kAAA §r§4Mimicry §8§l§kAAA')
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip("§4§lThe yearning to imitate the human form is sloppily reflected on the E.G.O, as if it were a reminder that it should remain a mere desire.")
    .tooltip("§4§lWhen the unfamiliar and otherworldly eyes stare at you, you will feel a chill up your spine.")
    .tooltip('§8§lUpgraded.')
    .tooltip('Heals you for 25% of your damage while this is in your hand.')
    .parentModel('thecatlord:item/mimicry')
    .texture('thecatlord:item/mimicry')
    .speed(9)
    .attackDamageBonus(16)
})
StartupEvents.registry('item', event => {
  event.create('tibia', 'sword')
  .displayName('§4§l§kAAA §r§7Tibia §4§l§kAAA')
  .unstackable()
  .fireResistant(true)
  .rarity('EPIC')
  .tooltip('Inflicts Corpus which causes burst damage at 10 stacks.')
  .tooltip("§7§lVeins and arteries. The bicolor shades of red that will flow out of you... Aah...! Marvelous art!")
  .parentModel('thecatlord:item/tibia')
  .texture('thecatlord:item/tibia')
  .speed(9)
  .attackDamageBonus(4)
})
StartupEvents.registry('item', event => {
  event.create('callisto_tibia', 'sword')
  .displayName('§4§l§kAAA §r§7Tibia §4§l§kAAA')
  .unstackable()
  .fireResistant(true)
  .rarity('EPIC')
  .tooltip("§7§lVeins and arteries. The bicolor shades of red that will flow out of you... Aah...! Marvelous art!")
  .tooltip('Inflicts Corpus which causes burst damage at 10 stacks.')
  .tooltip('§8§lUpgraded.')
  .parentModel('thecatlord:item/tibia')
  .texture('thecatlord:item/tibia')
  .speed(9)
  .attackDamageBonus(16)
})

StartupEvents.registry('item', event => {
  event.create('executioner', 'sword')
    .displayName("§0§l§kAAA §r§6Executioner's Sword §0§l§kAAA")
    .unstackable()
    .fireResistant(true)
    .rarity('EPIC')
    .tooltip("§6§lEven if I'm the only one, I want to keep my eyes open.")
    .tooltip('Instantly kills any mob.')
    .parentModel('thecatlord:item/executioner_sword')
    .texture('kubejs:item/executioner_sword')
})
    const CORPUS_EFFECT = 'kubejs:corpus'

    const CORPUS_MAX_STACKS = 10
    const CORPUS_BURST_PERCENT = 0.25
    const CORPUS_MIN_BURST_DAMAGE = 2

    function getAmplifier(effectInstance) {
        if (effectInstance == null) return -1
        return effectInstance.amplifier
    }

    function dealCorpusDamage(entity) {
        let hpBase = entity.getMaxHealth()
        let damage = Math.max(CORPUS_MIN_BURST_DAMAGE, hpBase * CORPUS_BURST_PERCENT)

        try {
            entity.invulnerableTime = 0
        } catch (e) {}

        entity.attack(entity.damageSources().magic(), damage)
    }

    StartupEvents.registry('mob_effect', event => {
        event.create('corpus')
            .harmful()
            .color(0x8b0000)
            .effectTick((entity, amplifier) => {
                let active = entity.potionEffects.getActive(CORPUS_EFFECT)
                let currentAmp = getAmplifier(active)

                if (currentAmp < CORPUS_MAX_STACKS - 1) return

                entity.removeEffect(CORPUS_EFFECT)
                dealCorpusDamage(entity)
            })
})
