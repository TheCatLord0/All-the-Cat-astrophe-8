const SpellCasterRegistry = Java.loadClass('com.hollingsworth.arsnouveau.api.registry.SpellCasterRegistry')
const SpellCastEvent = Java.loadClass('com.hollingsworth.arsnouveau.api.event.SpellCastEvent')

const GLYPH_COOLDOWNS = {
    'toomanyglyphs:glyph_ray': 4,
    'ars_elemental:glyph_homing_projectile': 8,
    'ars_elemental:glyph_arc_projectile': 8,
    'ars_elemental:glyph_propagator_arc': 4,
    'ars_elemental:glyph_propagator_homing': 8,
    'not_enough_glyphs:glyph_propagate_plane': 8,
    'not_enough_glyphs:glyph_trail': 12,
    'ars_zero:effect_beam': 12,

    'ars_nouveau:glyph_burst': 8,
    'ars_nouveau:glyph_wall': 8,
    'ars_nouveau:glyph_linger': 12,
    'ars_nouveau:glyph_orbit': 12,
    'ars_nouveau:glyph_cut': 2,
    'ars_nouveau:glyph_crush': 4,
    'ars_nouveau:glyph_ignite': 2,
    'ars_nouveau:glyph_freeze': 2,
    'ars_nouveau:glyph_snare': 6,
    'ars_nouveau:glyph_hex': 6,
    'ars_nouveau:glyph_wither': 6,
    'ars_nouveau:glyph_heal': 6,
    'ars_nouveau:glyph_harm': 8,
    'ars_nouveau:glyph_fangs': 8,
    'ars_nouveau:glyph_lightning': 8,
    'ars_nouveau:glyph_bubble': 8,
    'ars_nouveau:glyph_cold_snap': 12,
    'ars_nouveau:glyph_flare': 12,
    'ars_nouveau:glyph_wind_shear': 12,
    'ars_nouveau:glyph_summon_wolves': 20,
    'ars_nouveau:glyph_summon_vex': 20,
    'ars_nouveau:glyph_summon_undead': 20,

    'ars_elemental:glyph_spark': 8,
    'ars_elemental:glyph_water_jet': 8,
    'ars_elemental:glyph_discharge': 12,
    'ars_elemental:glyph_poison_spores': 12,
    'ars_elemental:glyph_spike': 12,
    'ars_elemental:glyph_conflagrate': 16,
    'ars_elemental:glyph_cavitate': 16,
    'ars_elemental:glyph_summon_bee': 20,
    'ars_elemental:glyph_summon_slime': 20,
    'ars_hex:glyph_soul_shatter': 12,

    'ars_nouveau:glyph_amplify': 2,
    'ars_nouveau:glyph_aoe': 2,
    'ars_nouveau:glyph_pierce': 2,
    'ars_nouveau:glyph_split': 4,
    'ars_nouveau:glyph_accelerate': 1,
    'ars_nouveau:glyph_extend_time': 1
}

const BOOKS = [
    'ars_nouveau:novice_spell_book',
    'ars_nouveau:apprentice_spell_book',
    'ars_nouveau:archmage_spell_book',
    'ars_nouveau:creative_spell_book',
    'not_enough_glyphs:spell_binder'
]

const STAVES = [
    'ars_zero:novice_spell_staff',
    'ars_zero:mage_spell_staff',
    'ars_zero:archmage_spell_staff',
    'ars_zero:creative_spell_staff'
]

const spellCooldown = spell => {
    let ticks = 0
    if (spell) {
        spell.serializeRecipe().forEach(id => {
            ticks += GLYPH_COOLDOWNS[String(id)] || 0
        })
    }
    return Math.max(0, ticks)
}

NativeEvents.onEvent(SpellCastEvent, event => {
    if (event.isCanceled()) return
    const player = event.getEntity(), context = event.context
    if (!player || !player.isPlayer() || player.level.isClientSide()) return
    if (!context || context.getPreviousContext()) return

    const item = context.getCasterTool()
    if (!BOOKS.includes(String(item.id))) return

    const itemType = item.getItem()
    if (player.getCooldowns().isOnCooldown(itemType)) {
        event.setCanceled(true)
        return
    }

    const ticks = spellCooldown(event.spell)
    if (ticks > 0) player.addItemCooldown(itemType, ticks)
})

ItemEvents.rightClicked(STAVES, event => {
    const { player, server, item } = event
    if (!player || !server) return

    const itemType = item.getItem()
    if (player.getCooldowns().isOnCooldown(itemType)) return

    const caster = SpellCasterRegistry.from(item)
    if (!caster) return

    const firstSlot = caster.getCurrentSlot() * 3
    let ticks = 0
    for (let phase = 0; phase < 3; phase++) {
        ticks += spellCooldown(caster.getSpell(firstSlot + phase))
    }

    if (ticks <= 0) return
    server.scheduleInTicks(1, () => player.addItemCooldown(itemType, ticks))
})