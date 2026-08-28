const $RL=Java.loadClass('net.minecraft.resources.ResourceLocation')
const $Registries=Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
const $Effect=Java.loadClass('net.minecraft.world.effect.MobEffectInstance')
const $DamageEvent=Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent')

const effect=(namespace,path)=>$Registries.MOB_EFFECT.getHolder($RL.fromNamespaceAndPath(namespace,path)).get()
const GRACE=effect('kubejs','grace')
const SPEED=effect('minecraft','speed')
const JUMP=effect('minecraft','jump_boost')
const SATURATION=effect('minecraft','saturation')
function respawn(player){
  player.addEffect(new $Effect(GRACE,600,0,false,false,true))
  player.addEffect(new $Effect(SPEED,600,2,false,false,false))
  player.addEffect(new $Effect(JUMP,600,2,false,false,false))
  player.addEffect(new $Effect(SATURATION,600,0,false,false,false))
}
function join(player){
  player.addEffect(new $Effect(GRACE,200,0,false,false,true))
}
function remove(player){
  player.removeEffect(GRACE)
  player.removeEffect(SPEED)
  player.removeEffect(JUMP)
  player.removeEffect(SATURATION)
}
function mana(player){
  player.addEffect(new $Effect('irons_spellbooks:instant_mana',10,255,false,false,false))
}
PlayerEvents.respawned(event=>{
  respawn(event.player)
})
BlockEvents.broken(event=>{
  const player=event.player
  const broken = event.getBlock()
    if (broken != 'gravestone:gravestone') return
    if(player&&player.hasEffect(GRACE))
      remove(player)
      mana(player)
})
EntityEvents.afterHurt(event =>{
if (event.source.player) {
  let player = event.source.player
  if(player&&player.hasEffect(GRACE))
    {
      remove(player)
      mana(player)
    }
  }
})
NativeEvents.onEvent($DamageEvent,event=>{
  if(event.getEntity().hasEffect(GRACE)){event.setCanceled(true)}
})

PlayerEvents.loggedIn(event=>{
  join(event.player)
})