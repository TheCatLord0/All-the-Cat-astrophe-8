const $Level = Java.loadClass('net.minecraft.world.level.Level')
const $ParticleTypes = Java.loadClass('net.minecraft.core.particles.ParticleTypes')

const CHANNEL = 'martyr_core_blast'
const MARTYR_CORE = 'kubejs:martyr_core'

const BLAST_POWER = 12.0
const PARTICLE_RADIUS = 12.0
const SETS_FIRE = false
const COOLDOWN_MS = 1000

const martyrCoreCooldowns = new Map()

function sendParticles(level, particle, x, y, z, count, dx, dy, dz, speed) {
  level[
    'sendParticles(net.minecraft.core.particles.ParticleOptions,double,double,double,int,double,double,double,double)'
  ](
    particle,
    x,
    y,
    z,
    count,
    dx,
    dy,
    dz,
    speed
  )
}

function spawnMartyrCoreParticles(level, x, y, z) {
  sendParticles(level, $ParticleTypes.FLASH, x, y, z, 1, 0, 0, 0, 0)
  sendParticles(level, $ParticleTypes.EXPLOSION_EMITTER, x, y, z, 1, 0, 0, 0, 0)

  sendParticles(
    level,
    $ParticleTypes.EXPLOSION,
    x,
    y,
    z,
    80,
    PARTICLE_RADIUS,
    1.5,
    PARTICLE_RADIUS,
    0.12
  )

  sendParticles(
    level,
    $ParticleTypes.LARGE_SMOKE,
    x,
    y,
    z,
    160,
    PARTICLE_RADIUS,
    2.0,
    PARTICLE_RADIUS,
    0.04
  )

  const ringPoints = 32

  for (let i = 0; i < ringPoints; i++) {
    const angle = (Math.PI * 2 * i) / ringPoints
    const px = x + Math.cos(angle) * PARTICLE_RADIUS
    const pz = z + Math.sin(angle) * PARTICLE_RADIUS

    sendParticles(
      level,
      $ParticleTypes.POOF,
      px,
      y + 0.15,
      pz,
      3,
      0.25,
      0.15,
      0.25,
      0.02
    )
  }
}

NetworkEvents.dataReceived(CHANNEL, event => {
  const player = event.player
  if (!player) return
  if (player.spectator) return

  if (!hasEquippedCurio(player, MARTYR_CORE)) return

  const key = String(player.uuid)
  const now = Date.now()
  const last = martyrCoreCooldowns.get(key) || 0

  if (now - last < COOLDOWN_MS) return
  martyrCoreCooldowns.set(key, now)

  const level = player.level

  if (level.isClientSide && level.isClientSide()) return

  const x = player.x
  const y = player.y + 0.25
  const z = player.z

  spawnMartyrCoreParticles(level, x, y, z)

  level[
    'explode(net.minecraft.world.entity.Entity,double,double,double,float,boolean,net.minecraft.world.level.Level$ExplosionInteraction)'
  ](
    null,
    x,
    y,
    z,
    BLAST_POWER,
    SETS_FIRE,
    $Level.ExplosionInteraction.NONE
  )
})