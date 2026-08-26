const $RL=Java.loadClass('net.minecraft.resources.ResourceLocation')
const $Registries=Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
const $Effect=Java.loadClass('net.minecraft.world.effect.MobEffectInstance')
const $DamageEvent=Java.loadClass('net.neoforged.neoforge.event.entity.living.LivingIncomingDamageEvent')

const effect=(namespace,path)=>$Registries.MOB_EFFECT.getHolder($RL.fromNamespaceAndPath(namespace,path)).get()
const GRACE=effect('kubejs','grace')
const SPEED=effect('minecraft','speed')
const JUMP=effect('minecraft','jump_boost')

function apply(player){
  player.addEffect(new $Effect(GRACE,600,0,false,false,true))
  player.addEffect(new $Effect(SPEED,600,0,false,false,false))
  player.addEffect(new $Effect(JUMP,600,1,false,false,false))
}

function remove(player){
  player.removeEffect(GRACE)
  player.removeEffect(SPEED)
  player.removeEffect(JUMP)
}

PlayerEvents.respawned(event=>{
  apply(event.player)
})

BlockEvents.broken(event=>{
  const player=event.player
  if(player&&player.hasEffect(GRACE))remove(player)
})

NativeEvents.onEvent($DamageEvent,event=>{
  if(event.getEntity().hasEffect(GRACE))event.setCanceled(true)
})